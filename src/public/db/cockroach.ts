import { db } from './utils';

// https://www.prisma.io/docs/concepts/database-connectors/cockroachdb
const _ = db('cockroachdb');

// prettier-ignore
export default {
  Int8:                                          _.BigInt('Int8'),
  Bool:                                          _.Boolean('Bool'),
  TimeStamp: (precision?: number) =>             _.DateTime('Timestamp', precision),
  Timestamptz: (precision?: number) =>           _.DateTime('Timestamptz', precision),
  Time: (precision?: number) =>                  _.DateTime('Time', precision),
  Timetz: (precision?: number) =>                _.DateTime('Timetz', precision),
  Decimal: (precision: number, scale: number) => _.Decimal('Decimal', [precision, scale]),
  Float4:                                        _.Float('Float4'),
  Float8:                                        _.Float('Float8'),
  Int2:                                          _.Int('Int2'),
  Int4:                                          _.Int('Int4'),
  Char: (length?: number) =>                     _.String('Char', length),
  CatalogSingleChar:                             _.String('CatalogSingleChar'),
  String:                                        _.String('String'),
  Date:                                          _.DateTime('Date'),
  Inet:                                          _.String('Inet'),
  Bit: (length?: number) =>                      _.String('Bit', length),
  VarBit: (length?: number) =>                   _.String('VarBit', length),
  Oid:                                           _.Int('Oid'),
  Uuid:                                          _.String('Uuid'),
  JsonB:                                         _.Json('JsonB'),
};
