import { Modifier } from './modifiers';
import { FieldType } from './types';

// Physical column in the database
export type Column<T extends FieldType = FieldType> = {
  name: string;
  type: T;
  modifiers: Modifier<T>[];
};
