import * as Types from '../types';

export const Mixin = () => {
  const columns: Types.Column[] = [];

  const Field = (
    name: string,
    type: Types.Fields.Field<Types.Fields.Primitive>,
  ) => {
    columns.push({ name, ...type });
    return { Field, columns };
  };

  return { Field, columns };
};
