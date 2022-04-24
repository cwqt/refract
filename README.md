# refract

A TypeScript CDK for [Prisma](https://www.prisma.io).

### Installation

```sh
yarn add @cwqt/refract

# Create a refract.ts file (see example)
# Then to generate the Prisma schema
npx ts-node refract.ts
```

## Example

`schema.ts`

```ts
// example from: https://www.prisma.io/docs/concepts/components/prisma-schema#example

// Enums
const Role = Enum('Role', ['USER', 'ADMIN'] as const);

// Define models first for circular relations
const Post = Model('Post');
const User = Model('User');

// Mixins (think inheritance)
const Timestamps = Mixin()
  .Field('createdAt', DateTime(Default('now()')))
  .Field('updatedAt', DateTime(UpdatedAt));

User.Field('id', Int(Index, Default('autoincrement()')))
  .Field('email', Varchar(Unique))
  .Field('name', Varchar(Nullable))
  .Field('role', Role('USER'))
  .Relation('posts', OneToMany(Post))
  // Use a mixin, adds createdAt & updatedAt columns to Model
  .Mixin(Timestamps);

Post.Field('id', Int(Index, Default('autoincrement()')))
  // Defaults are type-safe
  .Field('published', Boolean(Default(false)))
  .Field('title', Varchar(Limit(255)))
  .Field('authorId', Int(Nullable))
  // All kinds of relationships
  .Relation('author', ManyToOne(User, Pk('id').Fk('authorId'), Nullable))
  .Mixin(Timestamps)
  // Escape hatch into raw Prisma
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
      previewFeatures: ['referentialIntegrity'],
      engineType: 'library',
      binaryTargets: ['native'],
    },
  ],
  output: path.join(process.cwd(), 'myschema.prisma'),
  schema,
});

// Generate the schema with `npx ts-node refract.ts`
```

### Handling circular relationships

At some point you'll wanna split the schema across files, which introduces issues circular relationships when you're importing for `.Relation()`s

One way to get around this is to have a file with all the models/enums defined, and have files import those & apply the fields, e.g.

```ts
// models.ts ------------------------------
const User = Model("User");
const Post = Model("Posts");
// ... and all the other Models

// users.ts ------------------------------
import { User, Post } from './models'

User
  .Field("id",        Int(Index, Default("autoincrement()")))
  .Relation("posts",  OneToMany(Post))

// posts.ts  ------------------------------
import { User, Post } from './models'

Post
  .Field("id",        Int(Index, Default("autoincrement()")))
  .Field("authorId",  Int())
  .Relation("author", ManyToOne(User, Pk("id").Fk("authorId")))

// refract.ts ------------------------------
import * as schema from './models'

// Adds the fields to the models!
require("./posts.ts");
require("./users.ts");

Refract({
  datasource: {...},
  generators: [...],
  schema
})
```

<div align="center">
  <img src="https://ftp.cass.si/=799p94e7.png" width="50%" >
</div>

Another way is to use a `string` instead of the model as the 1st argument of the Relation type, e.g. `.Relation("posts", OneToMany("Posts"))`.

## Caveats

- Only tested on `mysql`
- Doesn't have all features, yet (PRs welcome!)
- Made in two weekends while drinking 🥴
