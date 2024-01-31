import * as Types from '../types';
import { nonNullable } from '../types/utils';

// Don't really care about the `as unknown` casts too much
// as long as the public interface is type-safe....

// Self-referential type
type Type = {
  Raw: (value: string) => Type;
  Field: <T extends Types.Fields.Scalar | 'Enum' | 'Unsupported'>(
    name: string,
    type: Types.Fields.Field<T>,
    comment?: string,
  ) => Type;
  Block: <T extends Types.Fields.Compound>(
    type: Types.Fields.Field<T>,
    comment?: string,
  ) => Type;
} & Types.Blocks.Type;

type R = <M extends Types.Modifiers<'Type'>>(
  initial?: Types.Modifier<'Type', M>,
  ...modifiers: Types.Modifier<'Type', M>[]
) => Types.Fields.Field<'Type', M>;

export const Type = (name: string, comment?: string): Type & R =>
  new $Type(name, comment) as any; // _call

export class $Type extends Function implements Types.Blocks.Type, Type {
  name: string;
  type: 'type' = 'type';
  columns: Types.Column<Types.FieldType>[] = [];

  constructor(name: string, comment?: string) {
    super();

    this.name = name;

    if (comment) {
      this.columns.push({
        name: 'comment',
        type: 'Comment' as const,
        modifiers: [{ type: 'value', value: comment }],
      } as Types.Column<Types.FieldType>);
    }

    // evil object reference proxy hacking _call overrides gives us nice curried classes
    return new Proxy(this, {
      apply: (
        target,
        _,
        args: [Types.Modifier<'Type'>, ...Types.Modifier<'Type'>[]],
      ) => target._call(...(args as any)),
    });
  }

  _call(...modifiers: Types.Modifier<'Type'>[]): Types.Fields.Field<'Type'>;
  _call(
    initial: Types.Modifier<'Type'>,
    ...modifiers: Types.Modifier<'Type'>[]
  ): Types.Fields.Field<'Type'> {
    return {
      type: 'Type' as const,
      modifiers: [
        { type: 'type' as const, value: this.name },
        ...[
          typeof initial == 'string'
            ? {
                type: 'default',
                value: initial,
              }
            : (initial as Types.Modifier<'Type'>),
          ...modifiers,
        ],
      ].filter(
        (v, i, a) => nonNullable(v) && a.findIndex(m => m.type == v.type) === i,
      ) as Types.Modifier<'Type'>[],
    };
  }

  Raw(value: string) {
    const modifier: Types.Modifier<'Raw', 'value'> = { type: 'value', value };
    const column: Types.Column<'Raw'> = {
      name: 'raw',
      type: 'Raw' as const,
      modifiers: [modifier],
    };

    this.columns.push(column as Types.Column<Types.FieldType>);
    return this;
  }

  Field<T extends Types.Fields.Scalar | 'Enum' | 'Unsupported'>(
    name: string,
    type: Types.Fields.Field<T>,
    comment?: string,
  ) {
    if (comment)
      type.modifiers.push({ type: 'comment', value: comment } as any);

    this.columns.push({
      name,
      ...type,
    } as unknown as Types.Column<Types.FieldType>);
    return this;
  }

  Block<T extends Types.Fields.Compound>(
    type: Types.Fields.Field<T>,
    comment?: string,
  ) {
    if (comment)
      type.modifiers.push({ type: 'comment', value: comment } as any);

    this.columns.push(type as unknown as Types.Column<Types.FieldType>);
    return this;
  }
}
