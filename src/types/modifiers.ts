import { Type, TypeData } from './types';

// Column modifiers, e.g. @default(), @nullable() etc.
export type Modifier<
  T extends Type = Type,
  Property extends Modifiers<T> = Modifiers<T>,
> = { type: Property; value: TypeData[T][Property] };

export type Modifiers<T extends Type> = keyof TypeData[T];

// -------------------------------------------------------
import { Cockroach, Mongo, MySql, Postgres } from '../public/db';
import { Provider } from './config';

type Db = {
  mysql: typeof MySql;
  mongodb: typeof Mongo;
  postgresql: typeof Postgres;
  cockroach: typeof Cockroach;
};

type DbModifer = {
  scalar: string;
  type: string;
  value: any;
  provider: Provider;
};

type DbMap = Record<string, DbModifer | ((...args: any) => DbModifer)>;

// Converts the Function modifiers to the resulting DbModifiers
type Flatten<T extends DbMap> = {
  [index in keyof T]: T[index] extends (...args: any) => DbModifer
    ? ReturnType<T[index]>
    : T[index];
};

// Flattened version of Db
type FlattenedDb = { [db in keyof Db]: Flatten<Db[db]> };

// Get DbMap values as a Union for each DbMap
type FlatUnionDb = {
  [db in keyof FlattenedDb]: FlattenedDb[db][keyof FlattenedDb[db]];
};

// Flatten again to get rid of the keys & have one big union
type FlatFlatUnion = FlatUnionDb[keyof FlatUnionDb];

// Converts the big Union into being grouped by Scalar type (String, Int etc.)
type GroupBy<T extends Record<D, PropertyKey>, D extends keyof T> = {
  [K in T[D]]: T extends Record<D, K> ? T : never;
};

// Map into union of { type: value } -- { @db.mysql.TinyInt: number } | ...
type Transform<T extends Record<string, any>> = {
  [index in keyof T]: { [i in T[index]['type']]: T[index]['value'] };
};

type Map = Transform<GroupBy<FlatFlatUnion, 'scalar'>>;

// Merge Map into Scalars
export type MergeDbModifiers<T> = {
  // Ignore if not exists in DbMap for db
  [type in keyof T]: Map extends { [P in type]: infer _ }
    ? T[type] & Map[type]
    : T[type];
};
