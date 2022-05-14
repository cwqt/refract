import { Types } from '../..';
import { Fields } from '../../types';

const compound =
  <T extends Types.Fields.Compound>(type: T) =>
  (
    ...values: T extends '@@map' ? [name: string] : string[]
  ): Fields.Field<T> => ({
    type,
    modifiers: [{ type: 'values', value: values as any }],
  });

export const Id = compound('@@id');
export const Map = compound('@@map');
export const Index = compound('@@index');
export const Unique = compound('@@unique');
export const Ignore: Fields.Field<'@@ignore'> = {
  type: '@@ignore',
  modifiers: [],
};
