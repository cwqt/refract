import { db } from './utils';

// https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference#mysql
const _ = db('mysql');

// prettier-ignore
export default {
  Char: (value: string) =>       _.String('Char', value),
  VarChar: (value: number) =>    _.String('VarChar', value),
  TinyInt: (value: number) =>    _.Boolean('TinyInt', value),
  UnsignedBigInt:                _.BigInt('UnsignedBigInt'),
  BigInt:                        _.BigInt('BigInt'),
  SmallInt:                      _.BigInt('SmallInt'),
  UnsignedSmallInt:              _.Int('UnsignedSmallInt'),
  MediumInt:                     _.Int('MediumInt'),
  UnsignedMediumInt:             _.Int('UnsignedMediumInt'),
  Year:                          _.Int('Year'),
  Float:                         _.Float('Float'),
  Double:                        _.Float('Double'),
  VarBinary:                     _.Bytes('VarBinary'),
  LongBlob:                      _.Bytes('LongBlog'),
  TinyBlob:                      _.Bytes('TinyBlob'),
  MediumBlob:                    _.Bytes('MediumBlob'),
  Blob:                          _.Bytes('Blob'),
  Binary:                        _.Bytes('Binary'),
  Bit: (value: number) =>        _.Bytes('Bit', value),
  Date: (value:number) =>        _.DateTime('Date', value),
  DateTime: (value:number) =>    _.DateTime('DateTime', value),
  Timestamp: (value:number) =>   _.DateTime('Timestamp', value),
  Time: (value:number) =>        _.DateTime('Time', value),
  Json:                          _.Json('Json'),
  Text:                          _.String('Text'),
  Decimal: (...coords:Coords) => _.Decimal('Decimal', coords),
};

type Coords = [x: number, y: number];
