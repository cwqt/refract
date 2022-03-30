# refract

Generate Prisma from TypeScript

```ts
const Timestamps = Mixin("Timestamps")
  .Field("createdAt", DateTime(Default("now")))
  .Field("updatedAt", DateTime(Nullable));

const Status = Enum("Status")
  .Key("Voided")
  .Key("Pending")
  .Key("Paid")
  .Key("Unpaid");

export const Invoice = Model("Invoice")
  .Id("id", Int(Index, Default("autoincrement")))
  .Field("status", Status(Default(Status.Pending)))
  .Mixin(Timestamps);

export const User = Model("User")
  .Field("id", Int(Index, Default("autoincrement")))
  .Field("name", Varchar(Nullable, Unique))
  .Field("invoices", OneToMany(Invoice, "id"))
  .Mixin(Timestamps);
```

---

```ts
import Refract from "@cwqt/refract";
import * as models from "./models";

Refract({
  datasource: {
    provider: "postgresql",
    url: process.env.PG_URL,
    shadowDatabaseUrl: process.env.PG_SHADOW_URL,
    referentialIntegrity: true,
  },
  generators: [
    {
      provider: "prisma-client-js",
      previewFeatures: ["interactiveTransactions"],
      engineType: "library",
      binaryTargets: ["native"],
    },
  ],
  models,
});
```
