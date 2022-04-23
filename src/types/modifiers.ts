import { Type, TypeData } from './types';

// Column modifiers, e.g. @default(), @nullable() etc.
export type Modifier<
  T extends Type = Type,
  Property extends keyof TypeData[T] = keyof TypeData[T],
> = { type: Property; value: TypeData[T][Property] };
