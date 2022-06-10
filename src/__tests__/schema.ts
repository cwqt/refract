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
  MySql as db,
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
  Comment,
} from '../';
import { Decimal } from '../public/fields/scalars';

// roughly from: https://www.prisma.io/docs/concepts/components/prisma-schema#example

const Role = Enum(
  'Role',
  'This is the Role Enum',
  Key('ADMIN', Map('admin'), Comment('This is the admin role')),
  Key('USER', Map('user')),
  Key('OWNER', Map('owner'), Comment('This is the owner role')),
);

const Post = Model('Post');
const User = Model('User', 'This is the User model');
const Star = Model('Star');

// prettier-ignore
const Timestamps = Mixin()
  .Field('createdAt', DateTime(Default('now()')))
  .Field('updatedAt', DateTime(UpdatedAt, db.Date(6)));

// prettier-ignore
User
  .Field('id',          Int(Id, Default('autoincrement()'), Map('_id'), Raw("@db.Value('foo')")))
  .Field('email',       String(Unique, db.VarChar(4)))
  .Field('name',        String(Nullable))
  .Field('height',      Float(Default(1.80), Comment("The user model")))
  .Field('role',        Role('USER', Nullable))
  .Relation('posts',    OneToMany(Post, "WrittenPosts", Comment("Relations are cool")))
  .Relation('pinned',   OneToOne(Post, "PinnedPost", Nullable))
  .Mixin(Timestamps);

// prettier-ignore
Post
  .Field('id',          Int(Id, Default('autoincrement()'), db.UnsignedSmallInt))
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
  .Field('decimal',     Decimal(db.Decimal(10, 20)))
  .Field('postId',      Int(Nullable))
  .Relation('post',     ManyToOne(Post, Fields('postId'), References('id')))
  .Mixin(Timestamps)
  .Field("location",    Unsupported("polygon", Nullable))
  .Block(Compound.Unique(["A", "B"], Map("_AB_unique")))
  .Block(Compound.Index(["wow"], Map("_B_index"), Comment("Block level comments?")))
  .Block(Compound.Map("Group"))

export default [Role, User, Post, Star];

// let x = OneToOne(Post, 'WrittenPosts', Fields('wow'), References('wee'));
// let a = OneToOne(Post, Fields('bestPostId'), References('id')); // good
// let b = OneToOne(Post, References('id'), Fields('bestPostId')); // bad
// let c = OneToOne(Post, Fields('bestPostId')); // bad
// let d = OneToOne(Post); // good
