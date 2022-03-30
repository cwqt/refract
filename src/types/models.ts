// Primitive data-types
export type TypeData = {
  Int: { index?: true; default?: "autoincrement()" | number; nullable?: true };
  Varchar: { default?: string; nullable?: true };
  Boolean: { default?: boolean; nullable?: true };
  DateTime: { default?: "now()"; nullable?: true };
  // -- relationship
  OneToMany: { model: Model; nullable?: true };
};

export type PrimitiveType = "Int" | "Varchar" | "Boolean" | "DateTime";
export type RelationType = "OneToMany";
export type AnyType = PrimitiveType | RelationType;

export function isPrimitive(
  column: Column<AnyType>
): column is Column<PrimitiveType> {
  return !isRelation(column);
}

export function isRelation(
  column: Column<AnyType>
): column is Column<RelationType> {
  return ["OneToMany", "OneToOne"].includes(column.type);
}

// All possible column datatypes & their accepted modifiers/parameters
export type Type = keyof TypeData;

// Physical column in the database
export type Column<T extends Type = keyof TypeData> = {
  name: string;
} & Field<T>;

// Column data-type, Varchar, Int etc.
export type Field<T extends Type = keyof TypeData> = {
  type: T;
  modifiers: Array<Modifier>;
};

// Column modifiers, e.g. @default(), @nullable() etc.
export type Modifier<
  T extends Type = Type,
  Property extends keyof TypeData[T] = keyof TypeData[T]
> = { type: Property; value: TypeData[T][Property] };

// A database model / table
export type Model = {
  name: string;
  columns: Column[];
};
