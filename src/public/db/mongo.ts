import { db } from './utils';

// https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference#postgresql

const _ = db('mongodb');

export default {
  ObjectId: _.String('ObjectId'),
  String: _.String('String'),
};
