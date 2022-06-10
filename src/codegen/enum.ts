import * as Types from '../types';
import { nonNullable } from '../types/utils';
import { block } from './block';
import { column } from './column';
import { extractComments } from './model';

export const enumeration = (e: Types.Blocks.Enum): string => {
  const [comments, columns] = extractComments(e.columns);

  return [comments, block(`enum ${e.name}`, columns.map(column).join('\n'))]
    .filter(nonNullable)
    .join('\n')
    .trim();
};
