import * as Types from '../types';

// Self-referential type
type Model = {
  Mixin: (mixin: Types.Mixin) => Model;
  Raw: (value: string) => Model;
  Relation: (
    name: string,
    type: Types.Fields.Field<Types.Fields.Relation>,
  ) => Model;
  Field: (
    name: string,
    type: Types.Fields.Field<Types.Fields.Primitive>,
  ) => Model;
} & Types.Blocks.Model;

export const Model = (name: string): Model => {
  const model: Types.Blocks.Model = { type: 'model', name, columns: [] };

  const Mixin = (mixin: Types.Mixin) => {
    model.columns.push(...mixin.columns);
    return { Mixin, Raw, Field, Relation, ...model };
  };

  const Raw = (value: string): Model => {
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
  ): Model => {
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
  ): Model => {
    model.columns.push({ name, ...type });
    return { Mixin, Raw, Field, Relation, ...model };
  };

  return { Mixin, Raw, Field, Relation, ...model };
};
