import { Column } from './columns';
import { Modifier, Modifiers } from './modifiers';
import { Type, TypeData } from './types';
import { UnionToIntersection } from './utils';
import * as Types from './types';
import { Provider } from './config';
import { DbModifier } from '../public/db/utils';

// Column data-type, String, Int etc.
export type Field<T extends Type, M extends Modifiers<T> = Modifiers<T>> = {
  type: T;
  modifiers: Modifier<T, M>[];
};

export type EnumKey<T extends string = string> = {
  name: T;
  modifiers: Modifier<'EnumKey'>[];
};

export type Scalar = keyof Types.Scalars;
export type Enum = keyof Types.Enums;
export type Relation = keyof Types.Relations;
export type Compound = keyof Types.Compounds;

export type Any = Scalar | Relation | Enum | Compound | 'Raw' | 'Unsupported';

export type ReferentialAction =
  | 'Cascade'
  | 'Restrict'
  | 'NoAction'
  | 'SetNull'
  | 'SetDefault';

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

export function isComment(column: TopColumn): column is Column<'Comment'> {
  return column.type == 'Comment';
}

export function isCompound(column: TopColumn): column is Column<Compound> {
  return column.type.startsWith('@@');
}

export function isEnumKey(column: TopColumn): column is Column<'EnumKey'> {
  return column.type == 'EnumKey';
}

export function isEnum(column: TopColumn): column is Column<'Enum'> {
  return column.type == 'Enum';
}

export function isUnsupported(
  column: TopColumn,
): column is Column<'Unsupported'> {
  return column.type == 'Unsupported';
}

export function isRelation(column: TopColumn): column is Column<Relation> {
  return ['OneToMany', 'ManyToOne', 'OneToOne'].includes(column.type);
}

export function isDbModifier(
  column: Modifier<any>,
): column is DbModifier<string, Provider, string, any> {
  return (column.type as string).startsWith('@db');
}

export function isScalar(column: TopColumn): column is Column<Scalar> {
  return [
    isRelation(column),
    isEnumKey(column),
    isEnum(column),
    isCompound(column),
  ].every(v => v == false);
}
