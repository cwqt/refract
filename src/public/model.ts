import * as Types from "../types";

export const Model = (name: string) => {
  const model: Types.Blocks.Model = { type: "model", name, columns: [] };

  const Relation = (
    name: string,
    type: Types.Fields.Field<Types.Fields.Relation>
  ) => {
    if (type.type == "ManyToOne") {
      const references = type.modifiers[2] as unknown as Types.Modifier<
        "ManyToOne",
        "references"
      >;

      const missing = references.value.filter(
        (f) => !model.columns.map((c) => c.name).includes(f)
      );

      if (missing.length)
        throw new Error(
          `RelationshipErr: Referenced columns in 'references' don't exist in Model '${
            model.name
          }': ${missing.map((m) => `'${m}'`).join(", ")}`
        );
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
