import { Type, TypeData } from './types';
import { Field } from './fields';

// Physical column in the database
export type Column<T extends Type = keyof TypeData> = {
  name: string;
} & Field<T>;
