import { Types } from '../..';
import { Fields, Modifier } from '../../types';

const compound =
  <T extends Types.Fields.Compound, M>(type: T) =>
  (
    values: T extends '@@map' ? string : string[],
    ...modifiers: Modifier<T>[]
  ): Fields.Field<T> => ({
    type,
    modifiers: [{ type: 'values', value: values as any }, ...modifiers],
  });

export const Id = compound('@@id');
export const Map = compound('@@map');
export const Index = compound('@@index');
export const Unique = compound('@@unique');
export const Ignore: Fields.Field<'@@ignore'> = {
  type: '@@ignore',
  modifiers: [],
};
