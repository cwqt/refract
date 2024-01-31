export * from './public/modifiers';
export * from './public/model';
export * from './public/type';
export * from './public/mixin';
export * from './public/fields/scalars';
export * from './public/fields/enums';
export * from './public/fields/relations';
export * from './public/fields/unsupported';
export * as Compound from './public/fields/compounds';
export * as Types from './types';
export * from './public/db';

import { writeFile } from 'fs/promises';
import * as Types from './types';
import codegen from './codegen';

export default (config: Types.Config) => {
  const { schema, output, time } = codegen(config);

  return writeFile(output, schema, 'utf8').then(() =>
    console.log(`Created schema at: ${output} (${time} ms)`),
  );
};

export const generate = (config: Types.Config) => codegen(config).output;
