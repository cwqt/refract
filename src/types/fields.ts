import { Column } from './columns';
import { Modifier, Modifiers } from './modifiers';
import { FieldType, TypeData } from './types';
import { UnionToIntersection } from './utils';
import * as Types from './types';
import { Provider } from './config';
import { DbModifier } from '../public/db/utils';

// Column data-type, String, Int etc.
export type Field<
  T extends FieldType,
  M extends Modifiers<T> = Modifiers<T>,
> = {
  type: T;
  modifiers: Modifier<T, M>[];
};

export type EnumKey<T extends string = string> = {
  name: T;
  modifiers: Modifier<'EnumKey'>[];
};

export type Scalar = keyof Types.Scalars;
export type Enum = keyof Types.Enums;
export type Type = keyof Types.Type;
export type Relation = keyof Types.Relations;
export type Compound = keyof Types.Compounds;

export type Any =
  | Scalar
  | Relation
  | Enum
  | Type
  | Compound
  | 'Raw'
  | 'Unsupported';

export type ReferentialAction =
  | 'Cascade'
  | 'Restrict'
  | 'NoAction'
  | 'SetNull'
  | 'SetDefault';

// Top type for columns
type TopColumn = {
  name: string;
  type: FieldType;
  modifiers: Array<{
    type: keyof UnionToIntersection<
      { [type in FieldType]: TypeData[type] }[FieldType]
    >;
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

export function isType(column: TopColumn): column is Column<'Type'> {
  return column.type == 'Type';
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
  return (
    typeof column == 'object' &&
    [
      isRelation(column),
      isEnumKey(column),
      isEnum(column),
      isCompound(column),
    ].every(v => v == false)
  );
}
