import {
  Array,
  Default,
  Fields,
  Id,
  Int,
  ManyToOne,
  Map,
  Model,
  Nullable,
  OneToMany,
  OneToOne,
  References,
  String,
} from '../';
import codegen from '../codegen';
import { enumeration } from '../codegen/enum';
import { enumeration as enumerationColumn } from '../codegen/column';
import { Enum, Key } from '../public/fields/enums';
import * as Types from '../types';
import schema from './schema';

const generate = (
  schema: Types.Config['schema'],
  overrides: Partial<Types.Config> = {},
) =>
  codegen({
    schema,
    datasource: {
      url: 'env("DATABASE_URL")',
      provider: 'mysql',
      shadowDatabaseUrl: 'env("DATABASE_SHADOW_URL")',
      referentialIntegrity: 'prisma',
    },
    generators: [
      {
        name: 'client',
        provider: 'prisma-client-js',
        binaryTargets: [
          'native',
          'rhel-openssl-1.0.x',
          'linux-arm64-openssl-1.0.x',
          'darwin-arm64',
        ],
        previewFeatures: ['referentialIntegrity'],
      },
    ],
    ...overrides,
  });

describe('refract', () => {
  it('should generate the schema', () => {
    const { schema: prisma } = generate(schema);

    console.log(prisma);

    expect(replaceGeneratedTime(prisma)).toMatchSnapshot();
  });

  describe('should generate implicit many-to-many schema', () => {
    const Post = Model('Post');
    const Category = Model('Category');

    Post.Field('id', Int(Id, Default('autoincrement()'))).Relation(
      'categories',
      OneToMany(Category),
    );

    Category.Field('id', Int(Id, Default('autoincrement()'))).Relation(
      'posts',
      OneToMany(Post),
    );

    const implicit = generate([Post, Category]);
    console.log(implicit.schema);
  });

  describe('enum block generation', () => {
    it('should generate an enum', () => {
      const e = enumeration(
        Enum(
          'Example',
          Key('Qux'),
          Key('Foo', 'This is a comment'),
          Key('Bar', Map('Baz')),
        ),
      );

      expect(e).toMatchSnapshot();
    });

    it('should generate an enum with a comment', () => {
      const e = enumeration(
        Enum(
          'Example',
          'An Enum with a comment',
          Key('Qux'),
          Key('Foo', 'This is a comment'),
          Key('Bar', Map('Baz')),
        ),
      );

      expect(e).toMatchSnapshot();
    });
  });

  describe('enum column generation', () => {
    const e = Enum('Example', Key('Foo'), Key('Bar'));

    const asColumn = (e: Types.Fields.Field<'Enum'>): Types.Column<'Enum'> => ({
      name: 'test',
      ...(e as any),
    });

    const nonNullableNoDefault = e();
    expect(enumerationColumn(asColumn(nonNullableNoDefault))).toMatchSnapshot();

    const nullableNoDefault = e(Nullable);
    expect(enumerationColumn(asColumn(nullableNoDefault))).toMatchSnapshot();

    const nonNullableDefault = e('Foo');
    expect(enumerationColumn(asColumn(nonNullableDefault))).toMatchSnapshot();

    const nullableDefault = e('Foo', Nullable);
    expect(enumerationColumn(asColumn(nullableDefault))).toMatchSnapshot();
  });

  describe('should validate the schema and throw error when', () => {
    it('the other side of the relation is missing when specifying relation name', () => {
      const User = Model('User');
      const Post = Model('Post');

      User.Field('id', Int()).Relation(
        'posts',
        OneToMany(Post, 'WrittenPosts'),
      );
      Post.Field('authorId', Int(Nullable)).Relation(
        'author',
        ManyToOne(User, Fields('authorId'), References('id'), Nullable),
      );

      expect(() => generate([User, Post])).toThrow(
        "RelationshipErr: The other side of the relation 'posts' with name 'WrittenPosts' don't exist in model 'User'",
      );
    });

    it('the model have an ambiguous self relation', () => {
      const User = Model('User');

      User.Relation('friend', OneToOne(User));

      expect(() => generate([User])).toThrow(
        "RelationshipErr: The model 'User' have an ambiguous self relation. The fields 'friend' and 'User' both refer to 'User'. If they are part of the same relation add the same relation name for them with RelationName(<name>) modifier",
      );
    });

    it('some of the specified column in the Fields modifier are missing in the model', () => {
      const User = Model('User');
      const Post = Model('Post');

      User.Field('id', Int());
      Post.Relation(
        'author',
        ManyToOne(User, Fields('authorId'), References('id'), Nullable),
      );

      expect(() => generate([User, Post])).toThrow(
        "RelationshipErr: Columns in 'fields' don't exist in model 'Post': 'authorId'",
      );
    });

    it('some of the specified column in the References modifier are missing in the other side model', () => {
      const User = Model('User');
      const Post = Model('Post');

      Post.Field('authorId', Int()).Relation(
        'author',
        ManyToOne(User, Fields('authorId'), References('id'), Nullable),
      );

      expect(() => generate([User, Post])).toThrow(
        "RelationshipErr: Referenced columns in 'references' don't exist in model 'User': 'id'",
      );
    });

    it('the number of columns specified in the Fields and References modifiers are not equal', () => {
      const User = Model('User');
      const Post = Model('Post');

      User.Field('id', Int());
      Post.Field('authorId', Int())
        .Field('secondId', Int())
        .Relation(
          'author',
          ManyToOne(
            User,
            Fields('authorId', 'secondId'),
            References('id'),
            Nullable,
          ),
        );

      expect(() => generate([User, Post])).toThrow(
        "RelationshipErr: You must specify the same number of fields in 'fields' and 'references' for relation 'author' in model 'Post'",
      );
    });

    it('the types of columns specified in the Fields and References modifiers does not match', () => {
      const User = Model('User');
      const Post = Model('Post');

      User.Field('id', Int()).Field('name', String());
      Post.Field('authorId', Int())
        .Field('authorName', Int())
        .Relation(
          'author',
          ManyToOne(
            User,
            Fields('authorId', 'authorName'),
            References('id', 'name'),
            Nullable,
          ),
        );

      expect(() => generate([User, Post])).toThrow(
        "RelationshipErr: The type of the field 'authorName' in the model 'Post' does not match the type of the referenced field 'name' in model 'User'",
      );
    });

    it('there is a one-to-one relation with no scalar and not nullable', () => {
      const User = Model('User');
      const Post = Model('Post');

      User.Field('id', Int()).Relation('pinned', OneToOne(Post));
      Post.Field('pinnedById', Int()).Relation(
        'pinnedBy',
        OneToOne(User, Fields('pinnedById'), References('id'), Nullable),
      );

      expect(() => generate([User, Post])).toThrow(
        "RelationshipErr: The side of the one-to-one relation without a relation scalar must be optional\n(Model 'Post', relation 'pinned')",
      );
    });

    it('there is a scalar array field and not using the correct datasource', () => {
      const User = Model('User');

      User.Field('id', Int(Array));

      expect(() => generate([User])).toThrow(
        'ModifierErr: Scalar lists are only supported when using PostgreSQL or CockroachDB.',
      );
    });

    it('there is a scalar optional array field', () => {
      const User = Model('User');

      User.Field('id', Int(Array, Nullable));

      expect(() =>
        generate([User], {
          datasource: { provider: 'postgresql', url: 'url' },
        }),
      ).toThrow(
        "ModifierErr: Field 'id' cannot be an array and optional in the same time",
      );
    });
  });
});

function replaceGeneratedTime(schema: string): string {
  return schema.replace(/generated in [\d.]* ms/, 'generated in x ms');
}
