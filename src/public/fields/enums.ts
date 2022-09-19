import * as Types from '../../types';
import { isString, nonNullable } from '../../types/utils';

export const Key = <T extends string>(
  ...args:
    | [name: T, ...modifiers: Types.Modifier<'EnumKey'>[]]
    | [name: T, ...modifiers: Types.Modifier<'EnumKey'>[], comment: string]
): Types.Fields.EnumKey<T> => {
  const [name, ...modifiers] = args;

  // condition is true for when name & comment, without len check would always insert
  // a comment with the name of the key, e.g.
  // enum Foo {
  //   // Bar
  //   Bar
  // }
  return args.length >= 2 && isString(args[args.length - 1])
    ? {
        name,
        modifiers: [
          ...(modifiers.slice(
            0,
            modifiers.length - 1,
          ) as unknown as Types.Modifier<'EnumKey'>[]),
          { type: 'comment' as const, value: args[args.length - 1] as string },
        ],
      }
    : { name, modifiers: modifiers as Types.Modifier<'EnumKey'>[] };
};

class $Enum<K extends Types.Fields.EnumKey[]>
  extends Function
  implements Types.Blocks.Block<'enum'>
{
  type: 'enum' = 'enum' as const;
  columns: Types.Column<'EnumKey' | 'Comment'>[];

  constructor(public name: string, comment: string | null, keys: K) {
    super();

    // Define the keys of the enum
    this.columns = keys.map(
      k =>
        ({
          name: k.name,
          type: 'EnumKey' as const,
          modifiers: k.modifiers,
        } as Types.Column<'EnumKey' | 'Comment'>),
    );

    if (comment) {
      this.columns.unshift({
        name: 'comment',
        type: 'Comment' as const,
        modifiers: [{ type: 'value', value: comment }],
      } as Types.Column<'EnumKey' | 'Comment'>);
    }

    // evil object reference proxy hacking _call overrides
    // gives us nice curried classes
    return new Proxy(this, {
      apply: (
        target,
        _,
        args: [K[number] | Types.Modifier<'Enum'>, ...Types.Modifier<'Enum'>[]],
      ) => target._call(...(args as any)),
    });
  }

  _call(...modifiers: Types.Modifier<'Enum'>[]): Types.Fields.Field<'Enum'>;
  _call(
    initial: K[number] | Types.Modifier<'Enum'>,
    ...modifiers: Types.Modifier<'Enum'>[]
  ): Types.Fields.Field<'Enum'> {
    return {
      type: 'Enum' as const,
      modifiers: [
        { type: 'enum' as const, value: this.name },
        ...[
          typeof initial == 'string'
            ? {
                type: 'default',
                value: initial,
              }
            : (initial as Types.Modifier<'Enum'>),
          ...modifiers,
        ],
      ].filter(
        (v, i, a) => nonNullable(v) && a.findIndex(m => m.type == v.type) === i,
      ) as Types.Modifier<'Enum'>[],
    };
  }
}

// return type _call signature
type R<E extends Types.Fields.EnumKey[]> = (<M extends Types.Modifiers<'Enum'>>(
  initial?: E[number]['name'] | Types.Modifier<'Enum', M>,
  ...modifiers: Types.Modifier<'Enum', M>[]
) => Types.Fields.Field<'Enum', M>) &
  Types.Blocks.Enum;

export function Enum<E extends Types.Fields.EnumKey[]>(
  name: string,
  ...keys: E
): R<E>;
export function Enum<E extends Types.Fields.EnumKey[]>(
  name: string,
  comment: string,
  ...keys: E
): R<E>;
export function Enum<E extends Types.Fields.EnumKey[]>(
  name: string,
  ...args: [string, ...E] | E
): R<E> {
  const [comment, ...keys] = args;
  return new $Enum(
    name,
    typeof comment == 'string' ? comment : null,
    typeof comment == 'string' ? (keys as E) : ([comment, ...keys] as E),
  ) as any; // _call
}
