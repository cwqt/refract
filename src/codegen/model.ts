import { CommentsTypes } from '../public/fields/comments';
import * as Types from '../types';
import { nonNullable } from '../types/utils';
import { alignFields } from './align';
import { block } from './block';
import { column } from './column';

export const model = (model: Types.Blocks.Model): string => {
  const [comments, columns] = extractComments(model.columns);

  console.log('>>> columns im model', columns.filter((col) => col?.name === 'comment').map((c) => c.modifiers));
  columns.filter((col) => col?.name === 'archivedPosts').map((col) => console.log('archivedPosts', col?.modifiers))

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
  const isUsualComment = (c: Types.Column<any> | Types.Modifier<any>) => c?.type === CommentsTypes.Comment;
  const isAstComment = (c: Types.Column<any> | Types.Modifier<any>) => c?.type === CommentsTypes.AstComment;
  const isComment = (c: Types.Column<any> | Types.Modifier<any>) => isUsualComment(c) || isAstComment(c);

  return [
    // All comment rows for a model are placed outside the model block def
    columns
      .filter(c => isComment(c))
      .map(c => isAstComment(c) ? `/// ${c.modifiers[0].value}` : `// ${c.modifiers[0].value}`)
      .join('\n'),

    columns
      // Remove Comment and AstComment rows to prevent re-insertion
      .filter(c => !isComment(c))
      // Shift all comment modifiers to be on their own row as a Comment column
      .reduce(
        (cols, column) => [
          ...cols,
          ...column.modifiers
            .filter(c => isComment(c))
            .map(c => ({
              name: 'comment',
              type: c.type,
              modifiers: [c],
            })),
          {
            ...column,
            modifiers: column.modifiers.filter(c => !isComment(c)),
          },
        ],
        [],
      ),
  ];
};
