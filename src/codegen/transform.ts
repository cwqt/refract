import { Column } from "../types/columns";

// Prisma KV column types
type Primitive = Date | boolean | number | string;
type Properties = Record<string, Primitive | Array<Primitive> | Column>;

// Converts a Key-Value value into a Prisma KV value string
export const kv = (properties: Properties): string => {
  return Object.entries(properties)
    .map(([key, value]) => `\t${key} = ${transform(value)}`)
    .join("\n");
};

// Converts from Type to Prisma row string
export const transform = (value: Properties[string]): string => {
  switch (typeof value) {
    case "string":
      return `"${value}"`;
    case "number":
      return value.toString();
    case "boolean":
      return value == true ? "true" : "false";
    case "object":
      return JSON.stringify(value);
    default:
      return "";
  }
};
