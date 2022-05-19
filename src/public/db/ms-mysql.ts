// https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference#microsoft-sql-server

import { db } from './utils';

export const Nchar = (value: string) => db;
export const NVarChar = (value: string) => {};
export const NText = {};
export const UniqueIdentifier = {};
