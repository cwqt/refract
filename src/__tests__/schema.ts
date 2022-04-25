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
  Pk,
  OneToOne,
  Map,
  Key,
  Float,
  Ignore,
} from '../';

// from: https://www.prisma.io/docs/concepts/components/prisma-schema#example

const Role = Enum(
  'Role',
  Key('USER', Map('user')),
  Key('ADMIN'),
);

const Post = Model('Post');
const User = Model('User');

const Timestamps = Mixin()
  .Field('createdAt', DateTime(Default('now()')))
  .Field('updatedAt', DateTime(UpdatedAt));

User
  .Field('id',          Int(Id, Default('autoincrement()'), Map('_id')))
  .Field('email',       String(Unique))
  .Field('name',        String(Nullable, Ignore))
  .Field('height',      Float(Default(1.80)))
  .Field('role',        Role('USER', Nullable))
  .Relation('posts',    OneToMany(Post))
  .Field('bestPostId',  Int())
  .Relation('bestPost', OneToOne(Post, Pk('id').Fk('bestPostId')))
  .Mixin(Timestamps);

Post
  .Field('id',          Int(Id, Default('autoincrement()')))
  .Field('published',   Boolean(Default(false)))
  .Field('title',       String(Limit(255)))
  .Field('authorId',    Int(Nullable))
  .Relation('author',   ManyToOne(User, Pk('id').Fk('authorId'), Nullable))
  .Mixin(Timestamps)
  .Raw(`@@map("comments")`);

export default [Role, User, Post];
