import { Type, TypeData } from './types';

// Column modifiers, e.g. @default(), @nullable() etc.
export type Modifier<
  T extends Type = Type,
  Property extends Modifiers<T> = Modifiers<T>,
> = { type: Property; value: TypeData[T][Property] };

export type Modifiers<T extends Type> = keyof TypeData[T];
