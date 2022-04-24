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

export const Model = (name: string): Model => new CallableModel(name);

export class CallableModel implements Types.Blocks.Model, Model {
  name: string;
  type: 'model' = 'model';
  columns: Types.Column<keyof Types.TypeData>[] = [];

  constructor(name: string) {
    this.name = name;
  }

  Mixin(mixin: Types.Mixin) {
    this.columns.push(...mixin.columns);
    return this;
  }

  Raw(value: string) {
    const modifier: Types.Modifier<'Raw', 'value'> = { type: 'value', value };
    const column = {
      name: 'raw',
      type: 'Raw',
      modifiers: [modifier],
    };

    this.columns.push(column as Types.Column);
    return this;
  }

  Relation(name: string, type: Types.Fields.Field<Types.Fields.Relation>) {
    if (type.type == 'ManyToOne') {
      const references = type.modifiers[2] as unknown as Types.Modifier<
        'ManyToOne',
        'references'
      >;

      const missing = references.value.filter(
        f => !this.columns.map(c => c.name).includes(f),
      );

      // if (missing.length)
      //   throw new Error(
      //     `RelationshipErr: Referenced columns in 'references' don't exist in Model '${
      //       this.name
      //     }': ${missing.map(m => `'${m}'`).join(', ')}`,
      //   );
    }

    this.columns.push({ name, ...type });

    return this;
  }

  Field(name: string, type: Types.Fields.Field<Types.Fields.Primitive>) {
    this.columns.push({ name, ...type });
    return this;
  }
}
