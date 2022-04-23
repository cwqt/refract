import * as Types from "../types";
import { ForwardReference } from "../__tests__/schema";
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

type Relation = {
  fields: string[];
  references: string[];
};

const Fields = (...fields: string[]) => {
  return {
    Refs: (...references: string[]) => {
      return (model: Types.Blocks.Model): Relation => {
        const missing = model.columns
          .map((c) => c.name)
          .filter((k) => !fields.includes(k));

        if (missing.length) throw new Error("Missing field!");

        return { fields, references };
      };
    },
  };
};

Fields("hello").Refs("id");

const Relation = (model: Types.Blocks.Model) => {
  const relation: Relation = {
    fields: [],
    references: [],
  };
};

export const OneToMany = <M extends Types.Blocks.Model>(
  model: M,
  ...modifiers: Types.Modifier<"OneToMany">[]
): Types.Fields.Field<"OneToMany"> =>
  ({
    type: "OneToMany",
    modifiers: [{ type: "model", value: model }, ...modifiers],
  } as Types.Fields.Field<"OneToMany">);

export const ManyToOne = (
  model: Types.Blocks.Model,
  ...modifiers: Types.Modifier<"ManyToOne">[]
): Types.Fields.Field<"ManyToOne"> =>
  ({
    type: "ManyToOne",
    modifiers: [
      {
        type: "model",
        value: model,
      },
      ...modifiers,
    ],
  } as Types.Fields.Field<"ManyToOne">);
