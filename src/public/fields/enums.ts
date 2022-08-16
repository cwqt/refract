import * as Types from '../../types';
import { isString, nonNullable } from '../../types/utils';
import { CommentType, Comment, CommentsTypes } from './comments';

export const Key = <T extends string>(
  ...args:
    | [name: T, ...modifiers: Types.Modifier<'EnumKey'>[]]
    | [name: T, ...modifiers: Types.Modifier<'EnumKey'>[], comment: CommentType | string]
): Types.Fields.EnumKey<T> => {
  const [name, ...modifiers] = args;

  let lastElement = args[args.length - 1];

  if (isString(lastElement)) {
    lastElement = Comment(lastElement);
  }

  return lastElement.type === CommentsTypes.Comment || lastElement.type === CommentsTypes.AstComment
    ? {
        name,
        modifiers: [
          ...(modifiers.slice(
            0,
            modifiers.length - 1,
          ) as unknown as Types.Modifier<'EnumKey'>[]),
          { type: lastElement.type as unknown as 'comment', value: lastElement.value as string },
        ],
      }
    : { name, modifiers: modifiers as Types.Modifier<'EnumKey'>[] };
};

class $Enum<K extends Types.Fields.EnumKey[]>
  extends Function
  implements Types.Blocks.Block<'enum'>
{
  type: 'enum' = 'enum' as const;
  columns: Types.Column<'EnumKey' | 'Comment'>[];

  constructor(public name: string, comment: CommentType | string | null, keys: K) {
    super();

    // Define the keys of the enum
    this.columns = keys.map(
      k =>
        ({
          name: k.name,
          type: 'EnumKey' as const,
          modifiers: k.modifiers,
        } as Types.Column<'EnumKey' | 'Comment'>),
    );

    if (comment) {
      if (isString(comment)) {
        comment = Comment(comment);
      }
      this.columns.unshift({
        name: 'comment',
        type: comment.type,
        modifiers: [{ type: 'value', value: comment.value }],
      } as unknown as Types.Column<'EnumKey' | 'Comment'>);
    }

    // evil object reference proxy hacking _call overrides
    // gives us nice curried classes
    return new Proxy(this, {
      apply: (
        target,
        _,
        args: [K[number] | null, ...Types.Modifier<'Enum'>[]],
      ) =>
        target._call(
          args[0] as K[number],
          ...(args.slice(1, args.length - 1) as Types.Modifier<'Enum'>[]),
        ),
    });
  }

  _call(
    initial: K[number] | null = null,
    ...modifiers: Types.Modifier<'Enum'>[]
  ): Types.Fields.Field<'Enum'> {
    return {
      type: 'Enum' as const,
      modifiers: [
        // welcome to hell
        { type: 'enum' as const, value: this.name },
        initial
          ? { type: 'default' as const, value: initial }
          : initial === null
          ? { type: 'nullable' as const, value: true }
          : null,
        ...modifiers,
      ].filter(
        (v, i, a) => nonNullable(v) && a.findIndex(m => m.type == v.type) === i,
      ) as Types.Modifier<'Enum'>[],
    };
  }
}

// _call signature
type R<E extends Types.Fields.EnumKey[]> = (<M extends Types.Modifiers<'Enum'>>(
  initial?: E[number]['name'] | null,
  ...modifiers: Types.Modifier<'Enum', M>[]
) => Types.Fields.Field<'Enum', M>) &
  Types.Blocks.Enum;

export function Enum<E extends Types.Fields.EnumKey[]>(
  name: string,
  ...keys: E
): R<E>;
export function Enum<E extends Types.Fields.EnumKey[]>(
  name: string,
  comment: CommentType | string,
  ...keys: E
): R<E>;
export function Enum<E extends Types.Fields.EnumKey[]>(
  name: string,
  ...args: [CommentType | string, ...E] | E
): R<E> {
  let [comment, ...keys] = args;
  
  if (typeof comment === 'string') {
    comment = Comment(comment);
  }
  
  return new $Enum(
    name,
    comment ? comment as CommentType : null,
    (keys as E),
  ) as any; // _call
}
