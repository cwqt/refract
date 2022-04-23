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
} from "../";

// from: https://www.prisma.io/docs/concepts/components/prisma-schema#example
const Role = Enum("Role", ["USER", "ADMIN"] as const);

const Post = Model("Post");
const User = Model("User");

// prettier-ignore
User
  // .Field("id",          Int(Index, Default("autoincrement()")))
  .Field("createdAt",   DateTime(Default("now()")))
  .Field("email",       Varchar(Unique))
  .Field("name",        Varchar(Nullable))
  .Field("role",        Role("USER"))
  .Relation("posts",    OneToMany(Post));

// prettier-ignore
Post
  .Field("id",          Int(Index, Default("autoincrement()")))
  .Field("createdAt",   DateTime(Default("now()")))
  .Field("updatedAt",   DateTime(UpdatedAt))
  .Field("published",   Boolean(Default(false)))
  .Field("title",       Varchar(Limit(255)))
  .Field("authorId",    Int(Nullable))
  .Relation("author",   ManyToOne(User, Fields("id").Refs("authorId"), Nullable));

export default [Role, User, Post];
