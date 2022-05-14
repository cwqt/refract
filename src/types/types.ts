import { JsonValue } from '../codegen/lib/json';
import { Mongo, Pg } from '../public/db';
import { Model } from './blocks';
import { ReferentialAction } from './fields';

type Db = Mongo.Types | Pg.Types;

type Append<T, K> = { [index in keyof T]: T[index] & K };

type WithDb<T> = {
  [type in keyof T]: Db extends { [P in type]: infer U }
    ? Append<T[type], Db[type]>
    : T[type];
};

type X = WithDb<{ Int: { default: number }; String: { unique?: true } }>;

export type Scalars = Append<
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
      id?: true;
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

export type Enums = {
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

export type Relations = Append<
  {
    OneToMany: {};
    OneToOne: {
      fields?: string[];
      references?: string[];
      onUpdate?: ReferentialAction;
      onDelete?: ReferentialAction;
      nullable?: true;
    };
    ManyToOne: {
      fields: string[];
      references: string[];
      onUpdate?: ReferentialAction;
      onDelete?: ReferentialAction;
      nullable?: true;
    };
  },
  { name?: string; model: Model }
>;

export type Compounds = Append<
  {
    ['@@id']: {};
    ['@@unique']: {};
    ['@@index']: {};
    ['@@ignore']: {};
    ['@@map']: {};
  },
  { values: string[] }
>;

export type TypeData = Scalars &
  Compounds &
  Enums &
  Relations & {
    // Escape hatch -----------------------------------------
    Raw: { value: string };
  };

// All possible column datatypes & their accepted modifiers/parameters
export type Type = keyof TypeData;
