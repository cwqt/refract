import * as Types from '../types';
import { entries, isFn, nonNullable } from '../types/utils';
import { Enum as CallableEnum } from './enum';

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

type RelationFn<T extends Types.Blocks.Model> = (m: T | string) => Relation;
export type Relation = {
  fields: string[];
  references: string[];
};

export const Pk = (...references: string[]) => {
  return {
    Fk: (...fields: string[]) => {
      return (model: Types.Blocks.Model | string): Relation => {
        // FIXME: causes issues with circular relations because of field addition race condition
        // Assert that the referenced fields do actually exist in the opposite Model
        // const missing = fields.filter(
        //   r => !model.columns.map(c => c.name).includes(r),
        // );
        // if (missing.length)
        //   throw new Error(
        //     `RelationshipErr: Referenced columns in 'fields' don't exist in Model '${
        //       model.name
        //     }': ${missing.map(m => `'${m}'`).join(', ')}`,
        //   );

        return { fields, references };
      };
    },
  };
};

export const ManyToOne = <M extends Types.Blocks.Model>(
  model: M | string,
  relation: RelationFn<M>,
  ...modifiers: Types.Modifier<'ManyToOne'>[]
) => {
  const { fields, references } = relation(model);

  return {
    type: 'ManyToOne' as const,
    modifiers: [
      {
        type: 'model',
        value: model,
      },
      {
        type: 'fields',
        value: fields,
      },
      {
        type: 'references',
        value: references,
      },
      ...modifiers,
    ],
  } as Types.Fields.Field<'ManyToOne'>;
};

export const OneToOne = <M extends Types.Blocks.Model>(
  model: M,
  ...modifiers:
    | [RelationFn<M>, ...Types.Modifier<'OneToOne'>[]]
    | Types.Modifier<'OneToOne'>[]
) => {
  const relation = modifiers.shift();

  const relations = isFn<RelationFn<M>>(relation)
    ? entries(relation(model)).map(([key, value]) => ({
        type: key,
        value,
      }))
    : [relation];

  return {
    type: 'OneToOne' as const,
    modifiers: [
      {
        type: 'model',
        value: model,
      },
      ...relations,
      ...modifiers,
    ].filter(nonNullable),
  } as Types.Fields.Field<'OneToOne'>;
};
