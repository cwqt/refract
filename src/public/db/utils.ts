import { Provider } from '../../types';

export type DbModifier<
  T extends string,
  P extends Provider,
  N extends string,
  K,
> = {
  scalar: T;
  provider: P;
  value: K;
  type: N;
};

export const db = <P extends Provider>(provider: P) => {
  const type =
    <T extends string>(scalar: T) =>
    <N extends string, K = true>(
      name: N,
      value?: K | undefined,
    ): DbModifier<T, P, `@db.${P}.${N}`, K> => ({
      type: `@db.${provider}.${name}`,
      value,
      scalar,
      provider,
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
