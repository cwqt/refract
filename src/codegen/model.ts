import * as Types from '../types';
import { nonNullable } from '../types/utils';
import { alignFields } from './align';
import { block } from './block';
import { column } from './column';

export const model = (model: Types.Blocks.Model): string => {
  const [comments, columns] = extractComments(model.columns);

  return [
    comments,
    block(`model ${model.name}`, alignFields(columns.map(column).join('\n'))),
  ]
    .filter(nonNullable)
    .join('\n')
    .trim();
};

export const extractComments = (
  columns: Types.Column<any>[],
): [outside: string, columns: Types.Column[]] => {
  return [
    // All comment rows for a model are placed outside the model block def
    columns
      .filter(c => c.type == 'Comment')
      .map(c => `// ${c.modifiers[0].value}`)
      .join('\n'),

    columns
      // Remove Comment rows to prevent re-insertion
      .filter(c => c.type !== 'Comment')
      // Shift all comment modifiers to be on their own row as a Comment column
      .reduce(
        (cols, column) => [
          ...cols,
          ...column.modifiers
            .filter(c => c.type == 'comment')
            .map(c => ({
              name: 'comment',
              type: 'Comment',
              modifiers: [c],
            })),
          column,
        ],
        [],
      ),
  ];
};
