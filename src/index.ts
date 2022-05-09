export * from './public/modifiers';
export * from './public/model';
export * from './public/mixin';
export * from './public/fields/scalars';
export * from './public/fields/enums';
export * from './public/fields/relations';
export * as Types from './types';

import { writeFile } from 'fs/promises';
import * as Types from './types';
import codegen from './codegen';

export default (config: Types.Config) =>
  (({ schema, output, time }) =>
    writeFile(output, schema, 'utf8').then(() =>
      console.log(`Created schema at: ${output} (${time} ms)`),
    ))(codegen(config));
