export const isDate = (v: any): v is Date =>
  v instanceof Date && !isNaN(v as any);

export const isFn = <F extends Function>(v: any): v is F =>
  typeof v == 'function';

export const isString = (v: any): v is string => typeof v == 'string';

export const isArray = (v: any): v is any[] => Array.isArray(v);

type Entries<T> = {
  [K in keyof T]: [K, T[K]];
}[keyof T][];
export const entries = <T>(obj: T): Entries<T> => Object.entries(obj) as any;

export type UnionToIntersection<U> = (
  U extends any ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never;

export const del = <T extends Object, K extends keyof T | string>(
  object: T,
  key: K,
): Exclude<T, K> => (delete object[key as keyof T], object as any);

export function nonNullable<T>(value: T): value is NonNullable<T> {
  return value !== null && value !== undefined;
}

type Mutable<T> = { -readonly [P in keyof T]: T[P] };
export const shift = <T extends readonly any[]>(v: T): T[0] =>
  (v as Mutable<T>).shift();
