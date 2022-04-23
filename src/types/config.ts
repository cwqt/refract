import { Block } from './blocks';

export type Datasource = {
  provider: 'postgresql' | 'mysql' | 'sqlite' | 'sqlserver'; //'mongodb';
  url: string;
  shadowDatabaseUrl?: string;
  referentialIntegrity?: 'prisma' | 'foreignKeys';
};

type PreviewFeatures =
  | 'filterJson'
  | 'interactiveTransactions'
  | 'fullTextSearch'
  | 'referentialIntegrity'
  | 'dataProxy'
  | 'extendedIndexes'
  | 'fullTextIndex'
  | 'cockroachdb';

export type Generator = {
  name: string;
  provider: string;
  output?: string;
  previewFeatures?: PreviewFeatures[];
  engineType?: 'library' | 'binary';
  binaryTargets?: string[]; // TODO: enum
};

export type Config = {
  datasource: Datasource;
  generators: Generator[];
  output?: string;
  schema: Block[];
};

export const validate = (config: Config) => {
  if (config.datasource.referentialIntegrity) {
    if (
      !config.generators.some(g =>
        g.previewFeatures.includes('referentialIntegrity'),
      )
    )
      throw new Error(
        "Must have a generator with the 'referentialIntegrity' preview feature enabled to use referential integrity in the datasource",
      );
  }
};
