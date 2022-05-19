import { JsonValue } from '../codegen/lib/json';
import { MySql } from '../public/db';
import { Model } from './blocks';
import { ReferentialAction } from './fields';
import { UnionToIntersection } from './utils';

type Append<T, K> = { [index in keyof T]: T[index] & K };

type Db = { mysql: typeof MySql };

type PrefixKeys<T, P extends string> = {
  [index in keyof T as `${P}.${index & string}`]: T[index];
};

// type WithDbModifiers<T> = UnionToIntersection<
//   {
//     [db in keyof Db]: {
//       [type in keyof T]: Db[db] extends { [P in type]: infer U }
//         ? T[type] & PrefixKeys<Db[db][type], `db.${db}`>
//         : T[type];
//     };
//   }[keyof Db]
// >;

let x: Db['mysql'];

type V = typeof MySql;

type DbType = Record<string, (...args: any) => any>;

type DbFlatten<T extends DbType> = { [index in keyof T]: ReturnType<T[index]> };

type GroupBy<T extends Record<D, PropertyKey>, D extends keyof T> = {
  [K in T[D]]: T extends Record<D, K> ? T : never;
};

type L = DbFlatten<typeof MySql>[keyof DbFlatten<typeof MySql>];
type P = GroupBy<L, 'type'>;

type WithDx<T extends Record<string, DbType>> = {
  [db in keyof T]: GroupBy<DbFlatten<T[db]>[keyof DbFlatten<T[db]>], 'type'>;
}[keyof T];

type f = WithDx<Db>;

type Z = { [index in keyof f]: { [i in f[index]['name']]: f[index]['value'] } };

type WithDb<T> = {
  [type in keyof T]: Db extends { [P in type]: infer U }
    ? Append<T[type], Db[type]>
    : T[type];
};

type scalars = WithDb<S>;

// type UnionToTuple<T> = UnionToIntersection<
//   T extends any ? (t: T) => T : never
// > extends (_: any) => infer W
//   ? [...UnionToTuple<Exclude<T, W>>, W]
//   : [];

// type GroupedTypes<U extends string, K extends DbType> = {
//   [index in U]: ReturnType<K[keyof K]>['type'] extends index
//     ? ReturnType<K[keyof K]>
//     : string;
// };
//
// type P = GroupedTypes<Z, V>;

type S = {
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
};

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
