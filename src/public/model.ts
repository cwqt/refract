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
    comment?: string,
  ) => Model;
  Field: <T extends Types.Fields.Scalar | 'Enum' | 'Unsupported'>(
    name: string,
    type: Types.Fields.Field<T>,
    comment?: string,
  ) => Model;
  Block: <T extends Types.Fields.Compound>(
    type: Types.Fields.Field<T>,
    comment?: string,
  ) => Model;
} & Types.Blocks.Model;

export const Model = (name: string, comment?: string): Model =>
  new $Model(name, comment);

export class $Model implements Types.Blocks.Model, Model {
  name: string;
  type: 'model' = 'model';
  columns: Types.Column<Types.Type>[] = [];

  constructor(name: string, comment?: string) {
    this.name = name;

    if (comment) {
      this.columns.push({
        name: 'comment',
        type: 'Comment' as const,
        modifiers: [{ type: 'value', value: comment }],
      } as Types.Column<Types.Type>);
    }
  }

  Mixin(mixin: Types.Mixin) {
    this.columns.push(...(mixin.columns as Types.Column<Types.Type>[]));
    return this;
  }

  Raw(value: string) {
    const modifier: Types.Modifier<'Raw', 'value'> = { type: 'value', value };
    const column: Types.Column<'Raw'> = {
      name: 'raw',
      type: 'Raw' as const,
      modifiers: [modifier],
    };

    this.columns.push(column as Types.Column<Types.Type>);
    return this;
  }

  Relation<T extends Types.Fields.Relation>(
    name: string,
    type: Types.Fields.Field<T>,
    comment?: string,
  ) {
    if (comment)
      type.modifiers.push({ type: 'comment', value: comment } as any);
    this.columns.push({ name, ...type } as unknown as Types.Column<Types.Type>);
    return this;
  }

  Field<T extends Types.Fields.Scalar | 'Enum' | 'Unsupported'>(
    name: string,
    type: Types.Fields.Field<T>,
    comment?: string,
  ) {
    if (comment)
      type.modifiers.push({ type: 'comment', value: comment } as any);
    this.columns.push({ name, ...type } as unknown as Types.Column<Types.Type>);
    return this;
  }

  Block<T extends Types.Fields.Compound>(
    type: Types.Fields.Field<T>,
    comment?: string,
  ) {
    if (comment)
      type.modifiers.push({ type: 'comment', value: comment } as any);
    this.columns.push(type as unknown as Types.Column<Types.Type>);
    return this;
  }
}
