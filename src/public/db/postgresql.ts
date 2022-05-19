// https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference#postgresql
export const Bit = (value: number) => {};
export const Uuid = {};
export const Xml = {};
export const Inet = {};
export const Citext = {};

export type Types = {
  String: {
    Uuid: true;
    Citext: true;
  };
  // | 'Text'
  // | 'Char'
  // | 'VarChar'
  // | 'Bit'
  // | 'VarBit'
  // | 'Uuid'
  // | 'Xml'
  // | 'Inet'
  // | 'Citext';
};
