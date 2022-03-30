import * as Types from "./models";

export const Model = (name: string) => {
  const model: Types.Model = { name, columns: [] };

  const Field = (name: string, type: Types.Field) => {
    model.columns.push({ name, ...type });
    return { Field, ...model };
  };

  return { Field, ...model };
};

export const Int = (...modifiers: Types.Modifier<"Int">[]) =>
  ({ type: "Int", modifiers } as Types.Field<"Int">);

export const Varchar = (
  ...modifiers: Types.Modifier<"Varchar">[]
): Types.Field<"Varchar"> =>
  ({ type: "Varchar", modifiers } as Types.Field<"Varchar">);

export const Boolean = (
  ...modifiers: Types.Modifier<"Boolean">[]
): Types.Field<"Boolean"> =>
  ({ type: "Boolean", modifiers } as Types.Field<"Boolean">);

export const DateTime = (
  ...modifiers: Types.Modifier<"DateTime">[]
): Types.Field<"DateTime"> =>
  ({ type: "DateTime", modifiers } as Types.Field<"DateTime">);

export const Index: { type: "index"; value: true } = {
  type: "index",
  value: true,
};

export const OneToMany = (
  model: Types.Model,
  ...modifiers: Types.Modifier<"OneToMany">[]
): Types.Field<"OneToMany"> =>
  ({
    type: "OneToMany",
    modifiers: [{ type: "model", value: model }, ...modifiers],
  } as Types.Field<"OneToMany">);

// export const OneToOne = (
//   model: Types.Model,
//   columnId: string
// ): Types.Field<"OneToOne"> =>
//   ({
//     type: "OneToOne",
//     modifiers: [
//       { type: "model", value: model },
//       { type: "columnId", value: columnId },
//     ],
//   } as Types.Field<"OneToOne">);
