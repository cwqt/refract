import * as Types from '../types';
import { isScalar } from '../types/fields';
import { CommentType, Comment } from './fields/comments';

// Don't really care about the `as unknown` casts too much
// as long as the public interface is type-safe....

// Self-referential type
type Model = {
  Mixin: (...mixins: Types.Mixin[]) => Model;
  Raw: (value: string) => Model;
  Relation: <T extends Types.Fields.Relation>(
    name: string,
    type: Types.Fields.Field<T>,
    comment?: CommentType | string,
  ) => Model;
  Field: <T extends Types.Fields.Scalar | 'Enum' | 'Unsupported'>(
    name: string,
    type: Types.Fields.Field<T>,
    comment?: CommentType | string,
  ) => Model;
  Block: <T extends Types.Fields.Compound>(
    type: Types.Fields.Field<T>,
    comment?: CommentType | string,
  ) => Model;
} & Types.Blocks.Model;

export const Model = (name: string, comment?: CommentType | string): Model =>
  new $Model(name, comment);

export class $Model implements Types.Blocks.Model, Model {
  name: string;
  type: 'model' = 'model';
  columns: Types.Column<Types.Type>[] = [];

  constructor(name: string, comment?: CommentType | string) {
    this.name = name;

    if (comment) {
      if (typeof comment === 'string') {
        comment = Comment(comment);
      }
      this.columns.push({
        name: 'comment',
        type: comment.type as string,
        modifiers: [{ type: 'value', value: comment.value }],
      } as Types.Column<Types.Type>);
    }
  }

  Mixin(...mixins: Types.Mixin[]) {
    mixins.forEach(mixin =>
      this.columns.push(...(mixin.columns as Types.Column<Types.Type>[])),
    );

    return this;
  }

  Raw(value: string) {
    const modifier: Types.Modifier<'Raw', 'value'> = { type: 'value', value };
    const column: Types.Column<'Raw'> = {
      name: 'raw',
      type: 'Raw' as const,
      modifiers: [modifier],
    };

    this.columns.push(column as Types.Column<Types.Type>);
    return this;
  }

  Relation<T extends Types.Fields.Relation>(
    name: string,
    type: Types.Fields.Field<T>,
    comment?: CommentType | string,
  ) {
    if (comment) {
      if (typeof comment === 'string') {
        comment = Comment(comment);
      }
      type.modifiers.push({ type: comment.type, value: comment.value } as any);
    }

    console.log('>>> Relation', type);
    

    // Fields('column', Int())
    const fields = type.modifiers.find(m => m.type == 'fields');
    if (isScalar(fields?.value?.[1])) {
      this.Field(fields.value[0], fields.value[1]);
      // remove scalar from modifiers pre-codegen
      (fields.value as unknown as any[]).pop();
    }

    this.columns.push({ name, ...type } as unknown as Types.Column<Types.Type>);
    return this;
  }

  Field<T extends Types.Fields.Scalar | 'Enum' | 'Unsupported'>(
    name: string,
    type: Types.Fields.Field<T>,
    comment?: CommentType | string,
  ) {
    if (comment) {
      if (typeof comment === 'string') {
        comment = Comment(comment);
      }
      type.modifiers.push({ type: comment.type, value: comment.value } as any);
    }

    this.columns.push({ name, ...type } as unknown as Types.Column<Types.Type>);
    return this;
  }

  Block<T extends Types.Fields.Compound>(
    type: Types.Fields.Field<T>,
    comment?: CommentType | string,
  ) {
    if (comment) {
      if (typeof comment === 'string') {
        comment = Comment(comment);
      }
      type.modifiers.push({ type: comment.type, value: comment.value } as any);
    }

    this.columns.push(type as unknown as Types.Column<Types.Type>);
    return this;
  }
}
