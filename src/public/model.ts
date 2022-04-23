import * as Types from "../types";
import { Relation } from "../types/fields";

export const Model = (name: string) => {
  const model: Types.Blocks.Model = { type: "model", name, columns: [] };

  const Relation = (name:string, relation: Relation) => {


    model.columns.push({ name, type: relation.includes

    })

    return { Field, Relation, ...model };
  };

  const Field = (name: string, type: Types.Fields.Field) => {
    model.columns.push({ name, ...type });
    return { Field, Relation, ...model };
  };

  return { Field, Relation, ...model };
};
