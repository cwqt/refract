import {
  Boolean,
  Compound,
  DateTime,
  Default,
  Enum,
  Fields,
  Float,
  Id,
  Int,
  Key,
  Limit,
  ManyToOne,
  Map,
  Mixin,
  Model,
  MySql as Db,
  Nullable,
  OnDelete,
  OneToMany,
  OneToOne,
  OnUpdate,
  Raw,
  References,
  String,
  Unique,
  Unsupported,
  UpdatedAt,
} from '../';
import { Decimal } from '../public/fields/scalars';

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

// prettier-ignore
const Timestamps = Mixin()
  .Field('createdAt', DateTime(Default('now()')))
  .Field('updatedAt', DateTime(UpdatedAt, Db.Date(6)));

// prettier-ignore
User
  .Field('id',          Int(Id, Default('autoincrement()'), Map('_id'), Raw('@db.Value(\'foo\')')))
  .Field('email',       String(Unique))
  .Field('name',        String(Nullable))
  .Field('height',      Float(Default(1.80)))
  .Field('role',        Role('USER', Nullable))
  .Relation('posts',    OneToMany(Post, "WrittenPosts"))
  .Relation('pinned',   OneToOne(Post, "PinnedPost", Nullable))
  .Mixin(Timestamps);

// prettier-ignore
Post
  .Field('id',          Int(Id, Default('autoincrement()'), Db.UnsignedSmallInt))
  .Field('published',   Boolean(Default(false) ))
  .Field('title',       String(Limit(255)))
  .Field('authorId',    Int(Nullable))
  .Relation('author',   ManyToOne(User, "WrittenPosts", Fields('authorId'), References('id'), OnUpdate("Restrict"), OnDelete("SetNull"), Nullable))
  .Field('pinnedById',  Int(Nullable))
  .Relation('pinnedBy', OneToOne(User, "PinnedPost", Fields('pinnedById'), References('id'), Nullable))
  .Relation('stars',    OneToMany(Star))
  .Mixin(Timestamps)
  .Raw(`@@map("comments")`);

// prettier-ignore
Star
  .Field('id',          Int(Id, Default('autoincrement()')))
  .Field('decimal',     Decimal(Db.Decimal(10, 20)))
  .Field('postId',      Int(Nullable))
  .Relation('post',     ManyToOne(Post, Fields('postId'), References('id')))
  .Mixin(Timestamps)
  .Field("location",    Unsupported("polygon", Nullable))
  .Block(Compound.Unique(["A", "B"], Map("_AB_unique")))
  .Block(Compound.Index(["wow"], Map("_B_index")))
  .Block(Compound.Map("Group"))

export default [Role, User, Post, Star];

// let x = OneToOne(Post, 'WrittenPosts', Fields('wow'), References('wee'));
// let a = OneToOne(Post, Fields('bestPostId'), References('id')); // good
// let b = OneToOne(Post, References('id'), Fields('bestPostId')); // bad
// let c = OneToOne(Post, Fields('bestPostId')); // bad
// let d = OneToOne(Post); // good
