import * as Types from '../../types';
import { nonNullable } from '../../types/utils';

export const Enum = <E extends Types.Fields.EnumKey[]>(
  name: string,
  ...keys: E
): (<M extends Types.Modifiers<'Enum'>>(
  initial?: E[number]['name'] | null,
  ...modifiers: Types.Modifier<'Enum', M>[]
) => Types.Fields.Field<'Enum', M>) &
  Types.Blocks.Enum => new $Enum(name, keys) as any; // _call

export const Key = <T extends string>(
  name: T,
  ...modifiers: Types.Modifier<'EnumKey'>[]
): Types.Fields.EnumKey<T> => ({ name, modifiers });

class $Enum<K extends Types.Fields.EnumKey[]>
  extends Function
  implements Types.Blocks.Block<'enum'>
{
  type: 'enum' = 'enum' as const;
  columns: Types.Column<'EnumKey'>[];

  constructor(public name: string, keys: K) {
    super();

    // Define the keys of the enum
    this.columns = keys.map(k => ({
      name: k.name,
      type: 'EnumKey' as const,
      modifiers: k.modifiers,
    }));

    // evil object reference proxy hacking _call overrides
    // gives us nice curried classes
    return new Proxy(this, {
      apply: (
        target,
        _,
        args: [K[number] | null, ...Types.Modifier<'Enum'>[]],
      ) =>
        target._call(
          args[0] as K[number],
          ...(args.slice(1, args.length - 1) as Types.Modifier<'Enum'>[]),
        ),
    });
  }

  _call(
    initial?: K[number] | null,
    ...modifiers: Types.Modifier<'Enum'>[]
  ): Types.Fields.Field<'Enum'> {
    return {
      type: 'Enum' as const,
      modifiers: [
        { type: 'enum' as const, value: this.name },
        initial
          ? { type: 'default' as const, value: initial }
          : initial === null
          ? { type: 'nullable' as const, value: true }
          : null,
        ...modifiers,
      ].filter(
        (v, i, a) => nonNullable(v) && a.findIndex(m => m.type == v.type) === i,
      ) as Types.Modifier<'Enum'>[],
    };
  }
}
