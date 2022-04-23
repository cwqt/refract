import { Column } from './columns';

// A Prisma block level element
export type BlockType = 'model' | 'enum' | 'datasource' | 'db';
export type Block<T extends BlockType = BlockType> = {
  name: string;
  type: T;
  columns: Column[];
};

export type Model = Block<'model'>;
export type Enum = Block<'enum'>;

export function isEnum(block: Block): block is Block<'enum'> {
  return block.type == 'enum';
}

export function isModel(block: Block): block is Block<'model'> {
  return block.type == 'model';
}
