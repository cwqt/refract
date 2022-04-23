# refract

A TypeScript CDK for [Prisma](https://www.prisma.io).

```sh
yarn add @cwqt/refract

// Create refract.ts (see below example)
npx ts-node refract.ts
```

## Example

`schema.ts`

```ts
// inspired from from: https://www.prisma.io/docs/concepts/components/prisma-schema#example
const Role = Enum('Role', ['USER', 'ADMIN'] as const);

const Post = Model('Post');
const User = Model('User');

const Timestamps = Mixin()
  .Field('createdAt', DateTime(Default('now()')))
  .Field('updatedAt', DateTime(UpdatedAt));

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
  .Mixin(Timestamps)
  .Raw(`@@map("comments")`);

export default [Role, User, Post];
```

---

`refract.ts`

```ts
import Refract from '@cwqt/refract';
import schema from './schema';

Refract({
  datasource: {
    provider: 'postgresql',
    url: process.env.PG_URL,
    shadowDatabaseUrl: process.env.PG_SHADOW_URL,
    referentialIntegrity: 'prisma',
  },
  generators: [
    {
      provider: 'prisma-client-js',
      previewFeatures: ['interactiveTransactions'],
      engineType: 'library',
      binaryTargets: ['native'],
    },
  ],
  schema,
});
```
