import { JsonValue } from '../codegen/lib/json';
import { Model } from './blocks';

type Append<T, K> = { [index in keyof T]: T[index] & K };

type Scalars = Append<
  {
    Int: {
      unique?: true;
      id?: true;
      default?: 'cuid()' | 'autoincrement()' | 'uuid()' | number;
    };
    Float: {
      unique?: true;
      default?: number;
    };
    BigInt: {
      unique?: true;
      default?: BigInt;
    };
    Bytes: {
      unique?: true;
      default?: never; // FIXME: what should this be?
    };
    Decimal: {
      unique?: true;
      default?: number;
    };
    String: {
      unique?: true;
      default?: string | 'auto()';
      limit?: number;
    };
    Boolean: {
      unique?: true;
      default?: boolean;
    };
    DateTime: {
      default?: 'now()';
      updatedAt?: true;
    };
    Json: { default?: JsonValue };
    // TODO: https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference#unsupported
    // Unsupported: {},
  },
  { nullable?: true; map?: string; ignore?: true; raw?: string }
>;

type Enums = {
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
};

type Relations = {
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
};

export type TypeData = Scalars &
  Enums &
  Relations & {
    // Escape hatch -----------------------------------------
    Raw: { value: string };
  };

// All possible column datatypes & their accepted modifiers/parameters
export type Type = keyof TypeData;
