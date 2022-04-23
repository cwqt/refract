export const isDate = (v: any): v is Date =>
  v instanceof Date && !isNaN(v as any);

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
