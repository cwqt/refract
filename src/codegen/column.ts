import { modifier } from "./modifiers";
import * as Types from "../types";

// Converts a Column to a Prisma row string
export const column = (column: Types.Column): string => {
  if (Types.Fields.isEnum(column)) return enumeration(column);
  if (Types.Fields.isPrimitive(column)) return primitive(column);
  if (Types.Fields.isRelation(column)) return relation(column);

  return `ERROR: Couldn't figure out type for column: ${column.name}`;
};

const enumeration = (column: Types.Column<"Enum">) => {
  const [type, ...modifiers] = column.modifiers;
  const isNullable = modifiers;

  return `\t${column.name} ${type.value}${isNullable ? "?" : ""} ${modifiers
    .map((m) => modifier(column.type, m))
    .join(" ")}`;
};

const primitive = (column: Types.Column<Types.Fields.Primitive>) => {
  const isNullable = column.modifiers.find(({ type }) => type == "nullable");

  return `\t${column.name} ${
    column.type == "Varchar" // "String" is a keyword
      ? "String"
      : column.type
  }${isNullable ? "?" : ""} ${column.modifiers
    .map((m) => modifier(column.type, m))
    .join(" ")}`;
};

// TODO: relationships!
const relation = (column: Types.Column<Types.Fields.Relation>) => {
  const relationship: any = column.modifiers.find(
    (m) => (m.type as any) == "model"
  );

  console.log("----->", relationship);

  if (column.type == "OneToMany") {
    const relation = `\t${column.name} ${relationship.value.name}[]`;
    return relation;
  }

  return "";
};
