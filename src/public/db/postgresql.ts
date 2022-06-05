import { db } from './utils';

// https://www.prisma.io/docs/concepts/database-connectors/postgresql
const _ = db('postgresql');

// prettier-ignore
export default {
  BigInt:                                          _.BigInt('BigInt'),
  Boolean:                                         _.Boolean('Boolean'),
  Timestamp: (precision?: number) =>               _.DateTime('Timestamp', precision),
  Timestamptz: (precision?: number) =>             _.DateTime('Timestamptz', precision),
  Time: (precision?: number) =>                    _.DateTime('Time', precision),
  Timetz: (precision?: number) =>                  _.DateTime('Timetz', precision),
  Decimal: (precision?: number, scale?: number) => _.Decimal('Decimal', [precision, scale]),
  Real:                                            _.Float('Real'),
  DoublePrecision:                                 _.Float('DoublePrecision'),
  SmallInt:                                        _.Int('SmallInt'),
  Char: (length?: number) =>                       _.String('Char', length),
  VarChar: (length?: number) =>                    _.String('VarChar', length),
  Money:                                           _.Decimal('Money'),
  Text:                                            _.String('Text'),
  Date:                                            _.DateTime('Date'),
  Inet:                                            _.String('Inet'),
  Bit: (length?: number) =>                        _.String('Bit', length),
  VarBit: (length?: number) =>                     _.String('VarBit', length),
  Oid:                                             _.Int('Oid'),
  Uuid:                                            _.String('Uuid'),
  Json:                                            _.Json('Json'),
  JsonB:                                           _.Json('JsonB'),
  ByteA:                                           _.Bytes('ByteA'),
  Xml:                                             _.String('Xml'),
  Citext:                                          _.String('Citext'),
};
