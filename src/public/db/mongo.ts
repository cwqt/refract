import { db } from './utils';

// https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference#postgresql

const _ = db('mongo');

export default {
  ObjectId: _.String('ObjectId'),
  String: _.String('String'),
  Number: _.Int('Number'),
};
