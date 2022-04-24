import * as Types from '../types';
import { entries, isFn, shift } from '../types/utils';
import { Enum as CallableEnum } from './enum';
import { Model } from './model';

export const Enum = <K extends readonly string[]>(
  name: string,
  keys: K,
): ((
  initial?: K[number] | null,
  ...modifiers: Types.Modifier<'Enum'>[]
) => Types.Fields.Field<'Enum'>) &
  Types.Blocks.Enum => new CallableEnum(name, keys) as any; // _call

export const Int = (...modifiers: Types.Modifier<'Int'>[]) =>
  ({ type: 'Int', modifiers } as Types.Fields.Field<'Int'>);

export const Varchar = (...modifiers: Types.Modifier<'Varchar'>[]) =>
  ({ type: 'Varchar', modifiers } as Types.Fields.Field<'Varchar'>);

export const Boolean = (...modifiers: Types.Modifier<'Boolean'>[]) =>
  ({ type: 'Boolean', modifiers } as Types.Fields.Field<'Boolean'>);

export const Json = (...modifiers: Types.Modifier<'Json'>[]) =>
  ({ type: 'Json', modifiers } as Types.Fields.Field<'Json'>);

export const DateTime = (
  ...modifiers: Types.Modifier<'DateTime'>[]
): Types.Fields.Field<'DateTime'> =>
  ({ type: 'DateTime', modifiers } as Types.Fields.Field<'DateTime'>);

export const OneToMany = <M extends Types.Blocks.Model>(
  model: M,
  ...modifiers: Types.Modifier<'OneToMany'>[]
) =>
  ({
    type: 'OneToMany',
    modifiers: [{ type: 'model', value: model }, ...modifiers],
  } as Types.Fields.Field<'OneToMany'>);

type RelationFn<T extends Types.Blocks.Model> = (m: T) => Relation;
export type Relation = {
  fields: string[];
  references: string[];
};

export const Pk = (...fields: string[]) => {
  return {
    Fk: (...references: string[]) => {
      return (model: Types.Blocks.Model): Relation => {
        // Assert that the referenced fields do actually exist in the opposite Model
        console.log(fields, references, model);
        const missing = fields.filter(
          r => !model.columns.map(c => c.name).includes(r),
        );

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
  model: M,
  relation: RelationFn<M>,
  ...modifiers: Types.Modifier<'ManyToOne'>[]
) => {
  const { fields, references } = relation(model);

  return {
    type: 'ManyToOne',
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

  console.log('-->', (relation as any)?.());

  const relations = isFn<RelationFn<M>>(relation)
    ? entries(relation(model)).map(([key, value]) => ({
        type: key,
        value,
      }))
    : [relation];

  return {
    type: 'OneToOne',
    modifiers: [
      {
        type: 'model',
        value: model,
      },
      ...relations,
      ...modifiers,
    ],
  } as Types.Fields.Field<'OneToOne'>;
};
