import { Modifier } from './modifiers';
import { Type } from './types';

// Physical column in the database
export type Column<T extends Type = Type> = {
  name: string;
  type: T;
  modifiers: Modifier<T>[];
};
