import * as Types from "../types";

export const Model = (name: string) => {
  const model: Types.Blocks.Model = { type: "model", name, columns: [] };

  const Field = (name: string, type: Types.Fields.Field) => {
    model.columns.push({ name, ...type });
    return { Field, ...model };
  };

  return { Field, ...model };
};
