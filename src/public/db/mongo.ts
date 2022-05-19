import { db } from './utils';

export const ref = 'mongo' as const;

// https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference#postgresql
export const ObjectId = db('ObjectId');
export const String = db('String');

export type Types = {
  String: {
    ObjectId: true;
    String: true;
  };
  Int: {
    Poggers: false;
  };
};
