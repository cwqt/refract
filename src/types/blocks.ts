import { Column } from './columns';

// A Prisma block level element
export type BlockType = 'model' | 'enum' | 'type';
export type Block<T extends BlockType = BlockType> = {
  name: string;
  type: T;
  columns: T extends 'enum' ? Column<'EnumKey' | 'Comment'>[] : Column[];
};

export type Model = Block<'model'>;
export type Enum = Block<'enum'>;
export type Type = Block<'type'>;

export function isEnum(block: Block): block is Block<'enum'> {
  return block.type == 'enum';
}

export function isModel(block: Block): block is Block<'model'> {
  return block.type == 'model';
}

export function isType(block: Block): block is Block<'type'> {
  return block.type == 'type';
}
