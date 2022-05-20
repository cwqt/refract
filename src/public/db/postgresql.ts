import { db } from './utils';

// https://www.prisma.io/docs/concepts/database-connectors/postgresql
const _ = db('postgresql');

// prettier-ignore
export default {
  BigInt:                            _.BigInt('BigInt'),
  Boolean:                           _.Boolean('Boolean'),
  Timestamptz: (date: Date) =>       _.DateTime('Timestampz', date),
  Time: (date: Date) =>              _.DateTime('Time', date),
  Timetz: (date: Date) =>            _.DateTime('Timetz', date),
  Decimal: (x: number, y: number) => _.Decimal('Decimal', [x, y]),
  Real:                              _.Float('Real'),
  DoublePrecision:                   _.Float('DoublePrecision'),
  SmallInt:                          _.Int('SmallInt'),
  Char: (value: string) =>           _.String('Char', value),
  VarChar: (value: string) =>        _.String('VarChar', value),
  Money:                             _.Decimal('Money'),
  Text:                              _.String('Text'),
  TimeStamp:                         _.DateTime('TimeStamp'),
  Date:                              _.DateTime('Date'),
  Inet:                              _.String('Inet'),
  Bit:                               _.String('Bit'),
  VarBit:                            _.String('VarBit'),
  Oid:                               _.Int('Oid'),
  Uuid:                              _.String('Uuid'),
  Json:                              _.Json('Json'),
  JsonB:                             _.Json('JsonB'),
  ByteA:                             _.Bytes('ByteA'),
  Xml:                               _.String('Xml'),
  Citext:                            _.String('Citext'),
};
