import * as Types from '../../types';

const scalar =
  <T extends Types.FieldType>(type: T) =>
  <M extends Types.Modifiers<T>>(...modifiers: Types.Modifier<T, M>[]) => ({
    type,
    modifiers,
  });

export const Int = scalar('Int');
export const String = scalar('String');
export const Float = scalar('Float');
export const BigInt = scalar('BigInt');
export const Bytes = scalar('Bytes');
export const Boolean = scalar('Boolean');
export const Json = scalar('Json');
export const DateTime = scalar('DateTime');
export const Decimal = scalar('Decimal');
