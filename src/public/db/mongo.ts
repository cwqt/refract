import { db } from './utils';

// https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference#postgresql
export const ObjectId = db('ObjectId');
export const String = db('String');

export type Types = {
  String: 'ObjectId' | 'String';
};
