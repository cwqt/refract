import codegen from '../codegen';
import schema from './schema';
import * as Types from '../types';
import { Model } from '../public/model';
import {
  Fields,
  ManyToOne,
  OneToMany,
  OneToOne,
  References,
} from '../public/fields/relations';
import { Int, String } from '../public/fields/scalars';
import { Array, Nullable } from '../public/modifiers';

const baseConfig: Omit<Types.Config, 'schema'> = {
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
};

describe('refract', () => {
  it('should generate the schema', () => {
    const { schema: prisma } = codegen({ ...baseConfig, schema });

    console.log(prisma);

    expect(replaceGeneratedTime(prisma)).toMatchSnapshot();
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

      expect(() => codegen({ ...baseConfig, schema: [User, Post] })).toThrow(
        "RelationshipErr: The other side of the relation 'posts' with name 'WrittenPosts' don't exist in model 'User'",
      );
    });

    it('the model have an ambiguous self relation', () => {
      const User = Model('User');

      User.Relation('friend', OneToOne(User));

      expect(() => codegen({ ...baseConfig, schema: [User] })).toThrow(
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

      expect(() => codegen({ ...baseConfig, schema: [User, Post] })).toThrow(
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

      expect(() => codegen({ ...baseConfig, schema: [User, Post] })).toThrow(
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

      expect(() => codegen({ ...baseConfig, schema: [User, Post] })).toThrow(
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

      expect(() => codegen({ ...baseConfig, schema: [User, Post] })).toThrow(
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

      expect(() => codegen({ ...baseConfig, schema: [User, Post] })).toThrow(
        "RelationshipErr: The side of the one-to-one relation without a relation scalar must be optional\n(Model 'Post', relation 'pinned')",
      );
    });

    it('there is a scalar array field and not using the correct datasource', () => {
      const User = Model('User');

      User.Field('id', Int(Array));

      expect(() => codegen({ ...baseConfig, schema: [User] })).toThrow(
        'ModifierErr: Scalar lists are only supported when using PostgreSQL or CockroachDB.',
      );
    });

    it('there is a scalar optional array field', () => {
      const User = Model('User');

      User.Field('id', Int(Array, Nullable));

      expect(() =>
        codegen({
          ...baseConfig,
          datasource: { provider: 'postgresql', url: 'url' },
          schema: [User],
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
