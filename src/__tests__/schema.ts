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
} from "../";

// from: https://www.prisma.io/docs/concepts/components/prisma-schema#example
//
// model Post {
//   id        Int      @id @default(autoincrement())
//   createdAt DateTime @default(now())
//   updatedAt DateTime @updatedAt
//   published Boolean  @default(false)
//   title     String   @db.VarChar(255)
//   author    User?    @relation(fields: [authorId], references: [id])
//   authorId  Int?
// }
const Post = Model("Post")
  .Field("id", Int(Index, Default("autoincrement()")))
  .Field("createdAt", DateTime(Default("now()")))
  .Field("updatedAt", DateTime(UpdatedAt))
  .Field("published", Boolean(Default(false)))
  .Field("title", Varchar(Limit(255)));

// enum Role {
//   USER
//   ADMIN
// }
const Role = Enum("Role", ["USER", "ADMIN"] as const);

// model User {
//   id        Int      @id @default(autoincrement())
//   createdAt DateTime @default(now())
//   email     String   @unique
//   name      String?
//   role      Role     @default(USER)
//   posts     Post[]
// }
const User = Model("User")
  .Field("id", Int(Index, Default("autoincrement()")))
  .Field("createdAt", DateTime(Default("now()")))
  .Field("email", Varchar(Unique))
  .Field("name", Varchar(Nullable))
  .Field("role", Role("USER"))
  .Field("posts", OneToMany(Post));

export default [Role, User, Post];
