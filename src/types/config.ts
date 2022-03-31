import { Block } from "./blocks";

export type Datasource = {
  provider: "postgresql" | "mysql" | "sqlite" | "sqlserver" | "mongodb";
  url: string;
  shadowDatabaseUrl?: string;
  referentialIntegrity?: "prisma" | "foreignKeys";
};

export type Generator = {
  name: string;
  provider: string;
  output?: string;
  previewFeatures?: string[];
  engineType?: "library" | "binary";
  binaryTargets?: string[]; // TODO: enum
};

export type Config = {
  datasource: Datasource;
  generators: Generator[];
  blocks: Block[];
};
