// https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference#mysql

import { db } from './utils';

const _ = db('mysql');

export default {
  Char: (value: string) => _.String('Char' as const, value),
  VarChar: (value: string) => _.String('VarChar' as const, value),
  TinyInt: (value: number) => _.Boolean('TinyInt' as const, value),
  UnsignedSmallInt: _.Int('UnsignedSmallInt' as const),
  UnsignedBigInt: _.BigInt('UnsignedBigInt' as const),
  BigInt: _.BigInt('BigInt' as const),
  VarBinary: _.Bytes('VarBinary' as const),
  LongBlob: _.Bytes('LongBlog' as const),
  TinyBlob: _.Bytes('TinyBlob' as const),
  MediumBlob: _.Bytes('MediumBlob' as const),
  Blob: _.Bytes('Blob' as const),
  Binary: _.Bytes('Binary' as const),
  Date: _.DateTime('Date' as const),
  DateTime: _.DateTime('DateTime' as const),
  Timestamp: _.DateTime('Timestamp' as const),
  Time: _.DateTime('Time' as const),
  Float: _.Float('Float' as const),
  Double: _.Float('Double' as const),
  SmallInt: _.BigInt('SmallInt' as const),
  MediumInt: _.Int('MediumInt' as const),
  UnsignedMediumInt: _.Int('UnsignedMediumInt' as const),
  Year: _.Int('Year' as const),
  Json: _.Json('Json' as const),
  Text: _.String('Text' as const),
  Bit: (value: number) => _.Bytes('Bit' as const, value),
  Decimal: (x: number, y: number) => _.Decimal('Decimal' as const, [x, y]),
};
