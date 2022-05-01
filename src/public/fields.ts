import * as Types from '../types';
import { nonNullable } from '../types/utils';
import { Enum as CallableEnum } from './enum';
import { ReferentialAction, Relation } from '../types/fields';

// Scalars ------------------------------------------------
const scalar =
  <T extends Types.Type>(type: T) =>
  <M extends Types.Modifiers<T>>(...modifiers: Types.Modifier<T, M>[]) => ({
    type,
    modifiers,
  });

export const Int = scalar('Int');
export const String = scalar('String');
export const Float = scalar('Float');
export const BigInt = scalar('BigInt');
export const Bytes = scalar('Bytes');
export const Boolean = scalar('Boolean');
export const Json = scalar('Json');
export const DateTime = scalar('DateTime');
export const Decimal = scalar('Decimal');

// Enums --------------------------------------------------
export const Enum = <E extends Types.Fields.EnumKey[]>(
  name: string,
  ...keys: E
): (<M extends Types.Modifiers<'Enum'>>(
  initial?: E[number]['name'] | null,
  ...modifiers: Types.Modifier<'Enum', M>[]
) => Types.Fields.Field<'Enum', M>) &
  Types.Blocks.Enum => new CallableEnum(name, keys) as any; // _call

export const Key = <T extends string>(
  name: T,
  ...modifiers: Types.Modifier<'EnumKey'>[]
): Types.Fields.EnumKey<T> => ({ name, modifiers });

// Relationships ------------------------------------------
export const OneToMany = <M extends Types.Blocks.Model>(
  model: M,
  ...modifiers: Types.Modifier<'OneToMany'>[]
) =>
  ({
    type: 'OneToMany',
    modifiers: [{ type: 'model', value: model }, ...modifiers],
  } as Types.Fields.Field<'OneToMany'>);

export const RelationName = <T extends Relation>(
  name: string,
): Types.Modifier<T, 'name'> => ({
  type: 'name',
  value: name,
});

export const Fields = <T extends 'OneToOne' | 'ManyToOne'>(
  ...fields: string[]
): Types.Modifier<T, 'fields'> => ({
  type: 'fields',
  value: fields,
});

export const References = <T extends 'OneToOne' | 'ManyToOne'>(
  ...references: string[]
): Types.Modifier<T, 'references'> => ({
  type: 'references',
  value: references,
});

export const OnUpdate = <T extends 'OneToOne' | 'ManyToOne'>(
  referentialAction: ReferentialAction,
): Types.Modifier<T, 'onUpdate'> => ({
  type: 'onUpdate',
  value: referentialAction,
});

export const OnDelete = <T extends 'OneToOne' | 'ManyToOne'>(
  referentialAction: ReferentialAction,
): Types.Modifier<T, 'onDelete'> => ({
  type: 'onDelete',
  value: referentialAction,
});

export const ManyToOne = <M extends Types.Blocks.Model>(
  model: M | string,
  ...modifiers: Types.Modifier<'ManyToOne'>[]
) => {
  return {
    type: 'ManyToOne' as const,
    modifiers: [
      {
        type: 'model',
        value: model,
      },
      ...modifiers,
    ].filter(nonNullable),
  } as Types.Fields.Field<'ManyToOne'>;
};

export const OneToOne = <M extends Types.Blocks.Model>(
  model: M,
  ...modifiers: Types.Modifier<'OneToOne'>[]
) => {
  return {
    type: 'OneToOne' as const,
    modifiers: [
      {
        type: 'model',
        value: model,
      },
      ...modifiers,
    ].filter(nonNullable),
  } as Types.Fields.Field<'OneToOne'>;
};
