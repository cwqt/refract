import { Type } from '../../types';

// export type Db<T extends string, K> = {
//   type: `@db.${T}`;
//   modifiers: [{ type: 'source'; value: string }, { type: 'value'; value: K }];
// };

export type DbModifier<
  T extends Type,
  S extends string,
  N extends string,
  K,
> = {
  type: T;
  source: S;
  value: K;
  name: N;
};

export const db = <S extends string>(source: S) => {
  const type =
    <T extends Type>(type: T) =>
    <N extends string, K>(
      name: N,
      value?: K | undefined,
    ): DbModifier<T, S, N, K> => ({ name, value, type, source });

  const BigInt = type('BigInt');
  const String = type('String');
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
