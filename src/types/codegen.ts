import dedent from "ts-dedent";
import { isDate } from "./utils";
import { Config } from "./config";
import {
  Column,
  isPrimitive,
  isRelation,
  Modifier,
  PrimitiveType,
  RelationType,
  Type,
} from "./models";

const del = <T extends Object, K extends keyof T | string>(
  object: T,
  key: K
): Exclude<T, K> => (delete object[key as keyof T], object as any);

// Takes a Config input & returns a generated Prisma schema file as a string
// which can then be written to a file / formatted by Prisma CLI
export const generate = (config: Config): string => {
  config.models = config.models.map((model) => del(model, "Field"));

  return dedent`
    ${header(`refract - ${process.env.npm_package_version}`)}
    ${header("datasource")}
    ${block("database db", kv(config.datasource))}

    ${header("generators")}
    ${config.generators
      .map((generator) =>
        block(`generator ${generator.name}`, kv(del(generator, "name")))
      )
      .join("\n")}

    ${header("models")}
    ${config.models
      .map((model) =>
        block(`model ${model.name}`, model.columns.map(parse).join("\n"))
      )
      .join("\n\n")}
`;
};

// Creates a nice header string
const header = (name: string, len: number = 80): string =>
  `// ${name} ${"-".repeat(len - name.length)}`;

// Converts a Column to a Prisma row string
const parse = (column: Column): string => {
  console.log(JSON.stringify(column, null, 2));

  const isNullable = column.modifiers.find(
    (modifier) => modifier.type == "nullable" && modifier.value == true
  );

  // TODO: less shitty way of doing this
  const modifier = (type: Type, modifier: Modifier): string => {
    switch (modifier.type as any) {
      case "default":
        return `@default(${transform(modifier.value)})`;
      case "index":
        return `@id`;
    }
  };

  const primitive = (column: Column<PrimitiveType>) => {
    return `\t${column.name} ${
      column.type == "Varchar" // "String" is a keyword
        ? "String"
        : column.type
    }${isNullable ? "?" : ""} ${column.modifiers
      .map((m) => modifier(column.type, m))
      .join(" ")}`;
  };

  // TODO: relationships!
  const relation = (column: Column<RelationType>) => {
    // FIXME: as any
    const relationship: any = column.modifiers.find(
      (m) => (m.type as any) == "model"
    );

    console.log("-->", relationship);

    if (column.type == "OneToMany") {
      const relation = `\t${column.name} ${relationship.value.name}[]`;

      return relation;
    }

    return "";
  };

  if (isPrimitive(column)) return primitive(column);
  if (isRelation(column)) return relation(column);

  return `ERROR: Couldn't figure out type for column: ${column.name}`;
};

// Converts from Type to Prisma row string
const transform = (value: Properties[string]): string => {
  switch (typeof value) {
    case "string":
      return `"${value}"`;
    case "number":
      return value.toString();
    case "object":
      return JSON.stringify(value);
  }
  return "";
};

// Prisma KV column types
type Primitive = Date | boolean | number | string;
type Properties = Record<string, Primitive | Array<Primitive> | Column>;
// Converts a Key-Value value into a Prisma KV value string
const kv = (properties: Properties): string => {
  return Object.entries(properties)
    .map(([key, value]) => `\t${key} = ${transform(value)}`)
    .join("\n");
};

// Creates a Block element string
const block = (name: string, content: string): string =>
  [`${name} {`, content, `}`].join("\n");
