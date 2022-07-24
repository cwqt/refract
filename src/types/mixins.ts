import { Fields, Type } from '.';
import { CommentType } from '../public/fields/comments';
import { Column } from './columns';

export type Mixin = {
  Field: <T extends Fields.Scalar | 'Enum' | 'Unsupported'>(
    name: string,
    type: Fields.Field<T>,
    comment?: CommentType | string,
  ) => Mixin;
  Block: <T extends Fields.Compound>(
    type: Fields.Field<T>,
    comment?: CommentType | string,
  ) => Mixin;
  columns: Column<Type>[];
};
