import * as Types from '../types';

export const Model = (name: string) => {
  const model: Types.Blocks.Model = { type: 'model', name, columns: [] };

  const Mixin = (mixin: Types.Mixin) => {
    model.columns.push(...mixin.columns);
    return { Mixin, Raw, Field, Relation, ...model };
  };

  const Raw = (value: string) => {
    const modifier: Types.Modifier<'Raw', 'value'> = { type: 'value', value };
    const column = {
      name: 'raw',
      type: 'Raw',
      modifiers: [modifier],
    };

    model.columns.push(column as Types.Column);

    return { Mixin, Raw, Field, Relation, ...model };
  };

  const Relation = (
    name: string,
    type: Types.Fields.Field<Types.Fields.Relation>,
  ) => {
    if (type.type == 'ManyToOne') {
      const references = type.modifiers[2] as unknown as Types.Modifier<
        'ManyToOne',
        'references'
      >;

      const missing = references.value.filter(
        f => !model.columns.map(c => c.name).includes(f),
      );

      if (missing.length)
        throw new Error(
          `RelationshipErr: Referenced columns in 'references' don't exist in Model '${
            model.name
          }': ${missing.map(m => `'${m}'`).join(', ')}`,
        );
    }

    model.columns.push({ name, ...type });

    return { Mixin, Raw, Field, Relation, ...model };
  };

  const Field = (
    name: string,
    type: Types.Fields.Field<Types.Fields.Primitive>,
  ) => {
    model.columns.push({ name, ...type });
    return { Mixin, Raw, Field, Relation, ...model };
  };

  return { Mixin, Raw, Field, Relation, ...model };
};
