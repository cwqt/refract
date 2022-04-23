import * as Types from "../types";
import { Enum as CallableEnum } from "./enum";

export const Enum = <K extends readonly string[]>(
  name: string,
  keys: K
): ((
  initial: K[number] | null,
  ...modifiers: Types.Modifier<"Enum">[]
) => Types.Fields.Field<"Enum">) &
  Types.Blocks.Enum => new CallableEnum(name, keys) as any; // _call

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

export const OneToMany = <M extends Types.Blocks.Model>(
  model: M,
  ...modifiers: Types.Modifier<"OneToMany">[]
): Types.Fields.Field<"OneToMany"> =>
  ({
    type: "OneToMany",
    modifiers: [{ type: "model", value: model }, ...modifiers],
  } as Types.Fields.Field<"OneToMany">);

export type Relation = {
  fields: string[];
  references: string[];
};

export const Fields = (...fields: string[]) => {
  return {
    Refs: (...references: string[]) => {
      return (model: Types.Blocks.Model): Relation => {
        // Assert that the referenced fields do actually exist in the opposite Model
        const missing = references.filter(
          (r) => !model.columns.map((c) => c.name).includes(r)
        );

        if (missing.length)
          throw new Error(
            `Referenced columns don't exist in Model '${model.name}': ${missing
              .map((m) => `'${m}'`)
              .join(", ")}`
          );

        return { fields, references };
      };
    },
  };
};

export const ManyToOne = <M extends Types.Blocks.Model>(
  model: M,
  relation: (m: M) => Relation,
  ...modifiers: Types.Modifier<"ManyToOne">[]
): Types.Fields.Field<"ManyToOne"> => {
  const { fields, references } = relation(model);

  return {
    type: "ManyToOne",
    modifiers: [
      {
        type: "model",
        value: model,
      },
      {
        type: "fields",
        value: fields,
      },
      {
        type: "references",
        value: references,
      },
      ...modifiers,
    ],
  } as Types.Fields.Field<"ManyToOne">;
};
