import {
  DateTime,
  Default,
  Enum,
  Id,
  Boolean,
  Int,
  Limit,
  Model,
  Nullable,
  OneToMany,
  Unique,
  UpdatedAt,
  String,
  ManyToOne,
  Mixin,
  OneToOne,
  Map,
  Key,
  Float,
  Raw,
  Fields,
  References,
} from '../';

// from: https://www.prisma.io/docs/concepts/components/prisma-schema#example

const Role = Enum(
  'Role',
  Key('ADMIN', Map('admin')),
  Key('USER', Map('user')),
  Key('OWNER', Map('owner')),
);

const Post = Model('Post');
const User = Model('User');

const Timestamps = Mixin()
  .Field('createdAt', DateTime(Default('now()')))
  .Field('updatedAt', DateTime(UpdatedAt));

// prettier-ignore
User
  .Field('id',          Int(Id, Default('autoincrement()'), Map('_id'), Raw('@db.Value(\'foo\')')))
  .Field('email',       String(Unique))
  .Field('name',        String(Nullable))
  .Field('height',      Float(Default(1.80)))
  .Field('role',        Role('USER', Nullable))
  .Relation('posts',    OneToMany(Post))
  .Field('bestPostId',  Int())
  .Relation('bestPost', OneToOne(Post, Fields('bestPostId'), References('id')))
  .Mixin(Timestamps);

// prettier-ignore
Post
  .Field('id',          Int(Id, Default('autoincrement()')))
  .Field('published',   Boolean(Default(false)))
  .Field('title',       String(Limit(255)))
  .Field('authorId',    Int(Nullable))
  .Relation('author',   ManyToOne(User, Fields('authorId'), References('id'), Nullable))
  .Mixin(Timestamps)
  .Raw(`@@map("comments")`);

export default [Role, User, Post];
