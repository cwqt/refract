# refract

See [here for a full demo](./demo.md).

---

# Model

```ts
const myModel = Model('ModelName');

// prettier-ignore
myModel
  .Field('id', Int(Id, Default('autoincrement()')));

// model ModelName {
//    id  Int @id @default(autoincrement())
// }
```

- `.Field(name, data-type)`: Add a primitive column to a Model
- `.Relation(name, relation)`: Add a relationship to a Model
- `.Raw(value)`: Prisma escape hatch for non-currently-supported features
  - `.Raw('@@map("comments")')`
- `.Mixin(mixin)`: Inherit columns from a Mixin for compositional Models

# Data types

All data-types take args (...modifiers), e.g: `DataType`: Modifier(args), Modifier

```ts
// Int @id @default(autoincrement())
const PrimaryKey = Int(Id, Default('autoincrement()'));
```

- `Int`
  - Default(number), Unique, Id, Nullable, Map, Raw
- `Float`
  - Default(Float), Nullable, Map, Raw
- `String`
  - Default(string), Unique, Limit, Nullable, Map, Raw
- `Boolean`
  - Default(boolean), Unique, Id, Limit(number), Nullable, Map, Raw
- `DateTime`
  - Default("now()"), UpdatedAt, Nullable, Map, Raw
- `Json`
  - Default(JsonValue), Nullable, Map, Raw
- `BigInt`
  - Default(BigInt), Nullable, Map, Raw
- `Decimal`
  - Default(number), Nullable, Map, Raw
- `Bytes`
  - Nullable, Map, Raw

You can use the `Raw()` modifier to use currently unsupported decorators, e.g.

```ts
const ObjectId = Raw('@db.ObjectId');

model.Field('id', String(ObjectId, Map('_id'), Default('auto()')));

// id   String  @db.ObjectId  @map("_id") @default(auto())
```

# Enums

Composed of two parts:

- `Enum(name, ...Key)`
- `Key(value, ...modifiers)`
  - Map

```ts
const Animal = Enum(
  'Animal',
  Key('Seacow'),
  Key('Capybara'),
  Key('Otter', Map('otter')),
);

// fave  Animal @default(Seacow)
model.Field('fave', Animal('Seacow'));
```

# Mixins

Allows you to re-use groups of fields

```ts
// prettier-ignore
const Timestamps = Mixin()
  .Field("createdAt", DateTime(Default("now()")))
  .Field("updatedAt", DateTime(Nullable, UpdatedAt))

// prettier-ignore
const User = Model("User")
  .Field("id", PrimaryKey)
  .Mixin(Timestamps)

// User will now have `createdAt` & `updatedAt` columns
```

# Relationships

- `OneToMany` (model, ...modifiers)
  - Nullable
- `OneToOne` (model, { fields, references }, ...modifiers)
- `OneToOne` (model, ...modifiers)
  - Nullable
- `ManyToOne` (model, { fieleds, references }, ...modifiers)
  - Nullable

## Examples

### OneToOne

```ts
const User = Model('User');
const Something = Model('something');

// prettier-ignore
Something
  .Field("id",      PrimaryKey)
  // Holds foreign key
  .Field("userId",  Int())
  .Relation("user", OneToOne(User, Pk("id").Fk("userId")));

// prettier-ignore
User
  .Field("id",      PrimaryKey)
  .Relation("thing", OneToOne(Something));
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
  .Field("id",        Int(Id, Default("autoincrement()")))
  .Relation("posts",  OneToMany(Post))

// posts.ts  ------------------------------
import { User, Post } from './models'

Post
  .Field("id",        Int(Id, Default("autoincrement()")))
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
