import { JsonValue } from '../codegen/lib/json';
import { Model } from './blocks';
import { ReferentialAction } from './fields';
import { MergeDbModifiers } from './modifiers';

type Append<T, K> = { [index in keyof T]: T[index] & K };

export type Scalars = Append<
  {
    String: {
      unique?: true;
      id?: true;
      default?: string | 'auto()';
      limit?: number;
    };
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
      default?: never;
    };
    Decimal: {
      unique?: true;
      default?: number;
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
  { nullable?: true; map?: string; ignore?: true; raw?: string; array?: true }
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
    ['@@unique']: { map: string };
    ['@@index']: { map: string };
    ['@@ignore']: {};
    ['@@map']: {};
  },
  { values: string[] }
>;

export type TypeData = MergeDbModifiers<Scalars> &
  Compounds &
  Enums &
  Relations & {
    Raw: { value: string };
    Unsupported: { unsupported: string; nullable?: true };
  };

// All possible column datatypes & their accepted modifiers/parameters
export type Type = keyof TypeData;
