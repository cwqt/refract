import { Type } from '../../types';

// export type Db<T extends string, K> = {
//   type: `@db.${T}`;
//   modifiers: [{ type: 'source'; value: string }, { type: 'value'; value: K }];
// };

export type DbModifier<
  T extends string,
  S extends string,
  N extends string,
  K,
> = {
  _type: T;
  source: S;
  value: K;
  type: N;
};

export const db = <S extends string>(source: S) => {
  const type =
    <T extends string>(type: T) =>
    <N extends string, K = true>(
      name: N,
      value?: K | undefined,
    ): DbModifier<T, S, `@db.${S}.${N}`, K> => ({
      type: `@db.${source}.${name}`,
      value,
      _type: type,
      source,
    });

  const BigInt = type('BigInt' as const);
  const String = type('String' as const);
  const Float = type('Float');
  const Json = type('Json');
  const Decimal = type('Decimal');
  const Bytes = type('Bytes');
  const DateTime = type('DateTime');
  const Boolean = type('Boolean');
  const Int = type('Int');

  return {
    BigInt,
    String,
    Float,
    Json,
    Decimal,
    Bytes,
    DateTime,
    Boolean,
    Int,
  };
};
