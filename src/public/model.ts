import * as Types from '../types';

// Don't really care about the `as unknown` casts too much
// as long as the public interface is type-safe....

// Self-referential type
type Model = {
  Mixin: (mixin: Types.Mixin) => Model;
  Raw: (value: string) => Model;
  Relation: <T extends Types.Fields.Relation>(
    name: string,
    type: Types.Fields.Field<T>,
  ) => Model;
  Field: <T extends Types.Fields.Scalar | 'Enum'>(
    name: string,
    type: Types.Fields.Field<T>,
  ) => Model;
} & Types.Blocks.Model;

export const Model = (name: string): Model => new CallableModel(name);

export class CallableModel implements Types.Blocks.Model, Model {
  name: string;
  type: 'model' = 'model';
  columns: Types.Column<Types.Type>[] = [];

  constructor(name: string) {
    this.name = name;
  }

  Mixin(mixin: Types.Mixin) {
    // FIXME: as unknown cast
    this.columns.push(
      ...(mixin.columns as unknown as Types.Column<Types.Type>[]),
    );
    return this;
  }

  Raw(value: string) {
    const modifier: Types.Modifier<'Raw', 'value'> = { type: 'value', value };
    const column: Types.Column<'Raw'> = {
      name: 'raw',
      type: 'Raw' as const,
      modifiers: [modifier],
    };

    // FIXME: as unknown cast
    this.columns.push(column as unknown as Types.Column<Types.Type>);
    return this;
  }

  Relation<T extends Types.Fields.Relation>(
    name: string,
    type: Types.Fields.Field<T>,
  ) {
    if (type.type == 'ManyToOne') {
      // FIXME: causes issues with circular relations because of field addition race condition
      // const references = type.modifiers[2] as unknown as Types.Modifier<
      //   'ManyToOne',
      //   'references'
      // >;
      // const missing = references.value.filter(
      //   f => !this.columns.map(c => c.name).includes(f),
      // );
      // if (missing.length)
      //   throw new Error(
      //     `RelationshipErr: Referenced columns in 'references' don't exist in Model '${
      //       this.name
      //     }': ${missing.map(m => `'${m}'`).join(', ')}`,
      //   );
    }

    // FIXME: as unknown cast
    this.columns.push({ name, ...type } as unknown as Types.Column<Types.Type>);

    return this;
  }

  Field<T extends Types.Fields.Scalar | 'Enum'>(
    name: string,
    type: Types.Fields.Field<T>,
  ) {
    // FIXME: as unknown cast
    this.columns.push({ name, ...type } as unknown as Types.Column<Types.Type>);
    return this;
  }
}
