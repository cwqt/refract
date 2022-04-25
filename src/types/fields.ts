import { Column } from './columns';
import { Modifier, Modifiers } from './modifiers';
import { Type, TypeData } from './types';
import { UnionToIntersection } from './utils';

// Column data-type, String, Int etc.
export type Field<T extends Type, M extends Modifiers<T> = Modifiers<T>> = {
  type: T;
  modifiers: Modifier<T, M>[];
};

export type EnumKey<T extends string = string> = {
  name: T;
  modifiers: Modifier<'EnumKey'>[];
};

export type Scalar =
  | 'Int'
  | 'Float'
  | 'BigInt'
  | 'Bytes'
  | 'Decimal'
  | 'String'
  | 'Boolean'
  | 'DateTime'
  | 'Json';

export type Enum = 'Enum' | 'EnumKey';
export type Relation = 'OneToMany' | 'OneToOne' | 'ManyToOne';

export type Any = Scalar | Relation | Enum | 'Raw';

// Top type for columns
type TopColumn = {
  name: string;
  type: Type;
  modifiers: Array<{
    type: keyof UnionToIntersection<{ [type in Type]: TypeData[type] }[Type]>;
    value: any;
  }>;
};

export function isRaw(column: TopColumn): column is Column<'Raw'> {
  return column.type == 'Raw';
}

export function isEnumKey(column: TopColumn): column is Column<'EnumKey'> {
  return column.type == 'EnumKey';
}

export function isEnum(column: TopColumn): column is Column<'Enum'> {
  return column.type == 'Enum';
}

export function isRelation(column: TopColumn): column is Column<Relation> {
  return ['OneToMany', 'ManyToOne', 'OneToOne'].includes(column.type);
}

export function isPrimitive(column: TopColumn): column is Column<Scalar> {
  return [isRelation(column), isEnumKey(column), isEnum(column)].every(
    v => v == false,
  );
}
