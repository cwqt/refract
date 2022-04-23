import * as Types from "../types";

export const Model = (name: string) => {
  const model: Types.Blocks.Model = { type: "model", name, columns: [] };

  const Relation = (
    name: string,
    type: Types.Fields.Field<Types.Fields.Relation>
  ) => {
    if (type.type == "ManyToOne") {
      // const [model, fields, references, ...modifiers] = type.modifiers;
      // const missing = fields.filter(
      //   (f) => !model.value.columns.map((c) => c.name).includes(f)
      // );
      //
      // if (missing.length)
      //   throw new Error(
      //     `Cannot find fields on model '${model.name}: ${missing.join(",")}`
      //   );
    }

    model.columns.push({ name, ...type });

    return { Field, Relation, ...model };
  };

  const Field = (
    name: string,
    type: Types.Fields.Field<Types.Fields.Primitive>
  ) => {
    model.columns.push({ name, ...type });
    return { Field, Relation, ...model };
  };

  return { Field, Relation, ...model };
};
