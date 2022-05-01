import { Column } from '../types/columns';
import { JsonValue } from './lib/json';
import { entries } from '../types/utils';

// Prisma KV column types
type Primitive =
  | Date
  | boolean
  | number
  | string
  | true
  | false
  | BigInt
  | JsonValue;

type Properties = Record<string, Primitive | Array<Primitive> | Column>;

// Converts a Key-Value value into a Prisma KV value string
export const kv = (properties: Properties): string => {
  return entries(properties)
    .map(([key, value]) => `\t${key} = ${transform(value)}`)
    .join('\n');
};

// Converts from Type to Prisma row string
export const transform = (value: Properties[string]): string => {
  switch (typeof value) {
    case 'string': {
      // Test if it matches a function call
      if (/^.*\(.*\)$/.test(value)) return value;

      return `"${value}"`;
    }
    case 'number':
      return value.toString();
    case 'boolean':
      return value == true ? 'true' : 'false';
    case 'object':
      return JSON.stringify(value);
    default:
      return '';
  }
};
