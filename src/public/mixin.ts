import * as Types from '../types';

export const Mixin = () => {
  const columns: Types.Column<Types.Fields.Scalar>[] = [];

  const Field = <T extends Types.Fields.Scalar>(
    name: string,
    type: Types.Fields.Field<T>,
  ) => {
    columns.push({
      name,
      ...type,
      // FIXME: unknown cast
    } as unknown as Types.Column<Types.Fields.Scalar>);

    return { Field, columns };
  };

  return { Field, columns };
};
