import {
  Boolean,
  DateTime,
  Index,
  Int,
  Model,
  OneToMany,
  Varchar,
} from "../types/fields";
import { Default, Nullable } from "../types/modifiers";

// prettier-ignore
const Invoice = Model("Invoice")
  .Field("id",                Int(Index, Default("autoincrement()")))
  .Field("amountPaid",        Int(Default(0)));
// .Field("userId", ManyToOne(User));

// prettier-ignore
const User = Model("User")
  .Field("id",                Int(Index, Default("autoincrement()")))
  .Field("howMuchYoureLoved", Int(Default(10)))
  .Field("updatedAt",         DateTime(Default("now()")))
  .Field("isSpecialInside",   Boolean(Default(false)))
  .Field("name",              Varchar(Nullable()))
  .Field("invoices",          OneToMany(Invoice, Nullable()));

export default [Invoice, User];
