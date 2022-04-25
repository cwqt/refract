import { JsonValue } from '../codegen/lib/json';
import { Model } from './blocks';

export type TypeData = {
  // Scalars ----------------------------------------------
  Int: {
    unique?: true;
    id?: true;
    default?: 'cuid()' | 'autoincrement()' | 'uuid()' | number;
    nullable?: true;
    map?: string;
    ignore?: true;
  };
  Float: {
    unique?: true;
    default?: number;
    nullable?: true;
    map?: string;
    ignore?: true;
  };
  BigInt: {
    unique?: true;
    default?: BigInt;
    nullable?: true;
    map?: string;
    ignore?: true;
  };
  Bytes: {
    unique?: true;
    default?: never; // FIXME: what should this be?
    nullable?: true;
    map?: string;
    ignore?: true;
  };
  Decimal: {
    unique?: true;
    default?: number;
    nullable?: true;
    map?: string;
    ignore?: true;
  };
  String: {
    unique?: true;
    default?: string;
    nullable?: true;
    limit?: number;
    map?: string;
    ignore?: true;
  };
  Boolean: {
    unique?: true;
    default?: boolean;
    nullable?: true;
    map?: string;
    ignore?: true;
  };
  DateTime: {
    default?: 'now()';
    nullable?: true;
    updatedAt?: true;
    map?: string;
    ignore?: true;
  };
  Json: { nullable?: true; default?: JsonValue; map?: string; ignore?: true };
  // TODO: https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference#unsupported
  // Unsupported: {},
  // Enums ------------------------------------------------
  Enum: {
    id?: true;
    nullable?: true;
    default?: string;
    ignore?: true;

    // Enum of which this is from
    enum: string;
  };
  // An entry in the enum, e.g. Enum("name", Key("Id", Map("_id")))
  EnumKey: {
    map?: string;
  };
  // Relationships ----------------------------------------
  OneToMany: { model: Model | string; nullable?: true };
  OneToOne: {
    model: Model | string;
    nullable?: true;
    fields: string[];
    references: string[];
  };
  ManyToOne: {
    nullable?: true;
    model: Model | string;
    fields: string[];
    references: string[];
  };
  // Escape hatch -----------------------------------------
  Raw: { value: string };
};

// All possible column datatypes & their accepted modifiers/parameters
export type Type = keyof TypeData;
