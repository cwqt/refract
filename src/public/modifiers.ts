import * as Types from '../types';

export const Default = <
  T extends Types.Fields.Scalar,
  K extends Types.TypeData[T]['default'],
>(
  value: K,
): Types.Modifier<T, 'default'> => ({ type: 'default', value });

export const Map = <
  T extends Types.Fields.Scalar | 'EnumKey',
  K extends Types.TypeData[T]['map'],
>(
  value: K,
): Types.Modifier<T, 'map'> => ({ type: 'map', value });

export const Unique = {
  type: 'unique',
  value: true,
} as const;

export const UpdatedAt = {
  type: 'updatedAt',
  value: true,
} as const;

export const Nullable = {
  type: 'nullable',
  value: true,
} as const;

export const Id = {
  type: 'id',
  value: true,
} as const;

export const Ignore = {
  type: 'ignore',
  value: true,
} as const;

export const Limit = <K extends Types.TypeData['String']['limit']>(
  value: K,
): Types.Modifier<'String', 'limit'> => ({ type: 'limit', value });
