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
  OnUpdate,
  OnDelete,
  Compound,
  Mongo as Db
} from '../';

// roughly from: https://www.prisma.io/docs/concepts/components/prisma-schema#example

const Role = Enum(
  'Role',
  Key('ADMIN', Map('admin')),
  Key('USER', Map('user')),
  Key('OWNER', Map('owner')),
);

const Post = Model('Post');
const User = Model('User');
const Star = Model('Star');

const Timestamps = Mixin()
  .Field('createdAt', DateTime(Default('now()')))
  .Field('updatedAt', DateTime(UpdatedAt));

User
  .Field('id',          Int(Id, Default('autoincrement()'), Map('_id'), Raw('@db.Value(\'foo\')')))
  .Field('email',       String(Unique))
  .Field('name',        String(Nullable))
  .Field('height',      Float(Default(1.80)))
  .Field('role',        Role('USER', Nullable))
  .Relation('posts',    OneToMany(Post, "WrittenPosts"))
  .Relation('pinned',   OneToOne(Post, "PinnedPost", Nullable))
  .Mixin(Timestamps);

Post
  .Field('id',          Int(Id, Default('autoincrement()')))
  .Field('published',   Boolean(Default(false)))
  .Field('title',       String(Limit(255)))
  .Field('authorId',    Int(Nullable))
  .Relation('author',   ManyToOne(User, "WrittenPosts", Fields('authorId'), References('id'), OnUpdate("Restrict"), OnDelete("SetNull"), Nullable))
  .Field('pinnedById',  Int(Nullable))
  .Relation('pinnedBy', OneToOne(User, "PinnedPost", Fields('pinnedById'), References('id'), Nullable))
  .Relation('stars',    OneToMany(Star))
  .Mixin(Timestamps)
  .Raw(`@@map("comments")`);

Star
  .Field('id',          Int(Id, Default('autoincrement()')))
  .Field('postId',      Int(Nullable))
  .Relation('post',     ManyToOne(Post, Fields('postId'), References('id')))
  .Mixin(Timestamps)
  .Block(Compound.Unique("id", "postId"))
  .Block(Compound.Map("wow"))

export default [Role, User, Post, Star];


// let x = OneToOne(Post, 'WrittenPosts', Fields('wow'), References('wee'));
// let a = OneToOne(Post, Fields('bestPostId'), References('id')); // good
// let b = OneToOne(Post, References('id'), Fields('bestPostId')); // bad
// let c = OneToOne(Post, Fields('bestPostId')); // bad
// let d = OneToOne(Post); // good
