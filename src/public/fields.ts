import * as Types from "../types";
import { Enum as EnumClass } from "./enum";

export const Enum = <K extends readonly string[]>(
  name: string,
  keys: K
): EnumClass<K> => new EnumClass(name, keys);

export const Int = (...modifiers: Types.Modifier<"Int">[]) =>
  ({ type: "Int", modifiers } as Types.Fields.Field<"Int">);

export const Varchar = (
  ...modifiers: Types.Modifier<"Varchar">[]
): Types.Fields.Field<"Varchar"> =>
  ({ type: "Varchar", modifiers } as Types.Fields.Field<"Varchar">);

export const Boolean = (
  ...modifiers: Types.Modifier<"Boolean">[]
): Types.Fields.Field<"Boolean"> =>
  ({ type: "Boolean", modifiers } as Types.Fields.Field<"Boolean">);

export const DateTime = (
  ...modifiers: Types.Modifier<"DateTime">[]
): Types.Fields.Field<"DateTime"> =>
  ({ type: "DateTime", modifiers } as Types.Fields.Field<"DateTime">);

export const OneToMany = (
  model: Types.Blocks.Model,
  ...modifiers: Types.Modifier<"OneToMany">[]
): Types.Fields.Field<"OneToMany"> =>
  ({
    type: "OneToMany",
    modifiers: [{ type: "model", value: model }, ...modifiers],
  } as Types.Fields.Field<"OneToMany">);
