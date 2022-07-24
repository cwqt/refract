export enum CommentsTypes {
  Comment = 'Comment',
  AstComment = 'AstComment'
}

const comment = (type: CommentsTypes) => (value: string): CommentType => ({
  type,
  value,
});

export const Comment = comment(CommentsTypes.Comment);

export const AstComment = comment(CommentsTypes.AstComment);

export type CommentType = {
  type: CommentsTypes
  value: string;
}