import * as Types from '../../types';
import { ReferentialAction, Relation } from '../../types/fields';
import { isString, nonNullable } from '../../types/utils';

// @relation("name", fields:[foo], references: ["bar"])
type OptionallyWithName<T extends Relation, M extends Types.Modifier<T>[]> =
  | [name: string, ...rest: M]
  | M;

export const OneToMany = <M extends Types.Blocks.Model>(
  model: M,
  ...modifiers: OptionallyWithName<'OneToMany', Types.Modifier<'OneToMany'>[]>
) =>
  ({
    type: 'OneToMany' as const,
    modifiers: [
      { type: 'model', value: model },
      ...(isString(modifiers[0])
        ? [{ type: 'name', value: modifiers[0] }, ...modifiers.slice(1)]
        : modifiers),
    ],
  } as Types.Fields.Field<'OneToMany'>);

export const ManyToOne = <
  T extends 'ManyToOne',
  M extends Types.Blocks.Model,
  K extends Types.Modifiers<'ManyToOne'>,
>(
  model: M,
  ...modifiers: OptionallyWithName<
    'ManyToOne',
    [
      fields: Types.Modifier<'ManyToOne', 'fields'>,
      references: Types.Modifier<'ManyToOne', 'references'>,
      ...modifiers: Types.Modifier<
        'ManyToOne',
        Exclude<K, 'fields' | 'references' | 'name'>
      >[],
    ]
  >
): Types.Fields.Field<T, K> => ({
  type: 'ManyToOne' as const as T,
  modifiers: [
    {
      type: 'model' as const,
      value: model,
    },
    ...(isString(modifiers[0])
      ? [{ type: 'name', value: modifiers[0] }, ...modifiers.slice(1)]
      : modifiers),
  ].filter(nonNullable) as Types.Modifier<T, K>[],
});

export const OneToOne = <
  T extends 'OneToOne',
  M extends Types.Blocks.Model,
  K extends Types.Modifiers<'OneToOne'>,
>(
  model: M,
  ...modifiers:
    | OptionallyWithName<
        'OneToOne',
        [
          fields: Types.Modifier<'OneToOne', 'fields'>,
          references: Types.Modifier<'OneToOne', 'references'>,
          ...modifiers: Types.Modifier<
            'OneToOne',
            Exclude<K, 'fields' | 'references' | 'name'>
          >[],
        ]
      >
    | OptionallyWithName<
        T,
        Types.Modifier<T, Exclude<K, 'fields' | 'references'>>[]
      >
): Types.Fields.Field<T, K> => ({
  type: 'OneToOne' as const as T,
  modifiers: [
    {
      type: 'model' as const,
      value: model,
    },
    ...(isString(modifiers[0])
      ? [{ type: 'name', value: modifiers[0] }, ...modifiers.slice(1)]
      : modifiers),
  ].filter(nonNullable) as Types.Modifier<T, K>[],
});

export const Fields = <T extends 'OneToOne' | 'ManyToOne'>(
  ...fields: string[]
): Types.Modifier<T, 'fields'> => ({
  type: 'fields' as const,
  value: fields,
});

export const References = <T extends 'OneToOne' | 'ManyToOne'>(
  ...references: string[]
): Types.Modifier<T, 'references'> => ({
  type: 'references' as const,
  value: references,
});

export const OnUpdate = <T extends 'OneToOne' | 'ManyToOne'>(
  referentialAction: ReferentialAction,
): Types.Modifier<T, 'onUpdate'> => ({
  type: 'onUpdate' as const,
  value: referentialAction,
});

export const OnDelete = <T extends 'OneToOne' | 'ManyToOne'>(
  referentialAction: ReferentialAction,
): Types.Modifier<T, 'onDelete'> => ({
  type: 'onDelete' as const,
  value: referentialAction,
});
