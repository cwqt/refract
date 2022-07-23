import { CommentType, Types } from '..';
import { JsonValue } from '../codegen/lib/json';
import { Model } from './blocks';
import { ReferentialAction, Scalar } from './fields';
import { MergeDbModifiers } from './modifiers';

type Append<T, K> = { [index in keyof T]: T[index] & K };

export type Scalars = Append<
  {
    String: {
      unique?: true;
      id?: true;
      default?: string | 'auto()';
      limit?: number;
    };
    Int: {
      unique?: true;
      id?: true;
      default?: 'cuid()' | 'autoincrement()' | 'uuid()' | number;
    };
    Float: {
      unique?: true;
      default?: number;
    };
    BigInt: {
      unique?: true;
      default?: BigInt;
    };
    Bytes: {
      unique?: true;
      default?: never;
    };
    Decimal: {
      unique?: true;
      default?: number;
    };
    Boolean: {
      unique?: true;
      default?: boolean;
    };
    DateTime: {
      default?: 'now()';
      updatedAt?: true;
    };
    Json: { default?: JsonValue };
  },
  {
    nullable?: true;
    map?: string;
    ignore?: true;
    raw?: string;
    array?: true;
    comment?: CommentType | string;
  }
>;

export type Enums = {
  Enum: {
    id?: true;
    nullable?: true;
    default?: string;
    ignore?: true;
    comment?: CommentType | string;

    // Enum of which this is from
    enum: string;
  };
  // An entry in the enum, e.g. Enum("name", Key("Id", Map("_id")))
  EnumKey: {
    map?: string;
    comment?: CommentType | string;
  };
};

export type Reference = [
  reference: string,
  scalar?: Types.Fields.Field<'Int'> | Types.Fields.Field<'String'>,
];

export type Relations = Append<
  {
    OneToMany: {};
    OneToOne: {
      fields?: string[] | Reference;
      references?: string[];
      onUpdate?: ReferentialAction;
      onDelete?: ReferentialAction;
      nullable?: true;
    };
    ManyToOne: {
      fields: string[] | Reference;
      references: string[];
      onUpdate?: ReferentialAction;
      onDelete?: ReferentialAction;
      nullable?: true;
    };
  },
  { name?: string; model: Model; comment?: CommentType | string }
>;

export type Compounds = Append<
  {
    ['@@id']: {};
    ['@@unique']: { map: string };
    ['@@index']: { map: string };
    ['@@ignore']: {};
    ['@@map']: {};
    ['@@fulltext']: {};
  },
  { values: string[]; comment?: CommentType | string }
>;

export type TypeData = MergeDbModifiers<Scalars> &
  Compounds &
  Enums &
  Relations & {
    Comment: CommentType | string;
    AstComment: CommentType | string;
    Raw: { value: string };
    Unsupported: { unsupported: string; nullable?: true };
  };

// All possible column datatypes & their accepted modifiers/parameters
export type Type = keyof TypeData;
