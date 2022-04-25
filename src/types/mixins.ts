import { Fields } from '.';
import { Column } from './columns';

export type Mixin = {
  columns: Column<Fields.Scalar>[];
};
