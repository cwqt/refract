import {
  DateTime,
  Default,
  Enum,
  Index,
  Boolean,
  Int,
  Limit,
  Model,
  Nullable,
  OneToMany,
  Unique,
  UpdatedAt,
  Varchar,
  ManyToOne,
  Fields,
  Mixin,
} from "../";

// from: https://www.prisma.io/docs/concepts/components/prisma-schema#example
const Role = Enum("Role", ["USER", "ADMIN"] as const);

const Post = Model("Post");
const User = Model("User");

const Timestamps = Mixin()
  .Field("createdAt", DateTime(Default("now()")))
  .Field("updatedAt", DateTime(UpdatedAt));

// prettier-ignore
User
  .Field("id",          Int(Index, Default("autoincrement()")))
  .Field("email",       Varchar(Unique))
  .Field("name",        Varchar(Nullable))
  .Field("role",        Role("USER"))
  .Relation("posts",    OneToMany(Post))
  .Mixin(Timestamps);

// prettier-ignore
Post
  .Field("id",          Int(Index, Default("autoincrement()")))
  .Field("published",   Boolean(Default(false)))
  .Field("title",       Varchar(Limit(255)))
  .Field("authorId",    Int(Nullable))
  .Relation("author",   ManyToOne(User, Fields("id").Refs("authorId"), Nullable))
  .Raw(`@@map("comments")`)
  .Mixin(Timestamps);

export default [Role, User, Post];
