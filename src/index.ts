export * from './public/modifiers';
export * from './public/fields';
export * from './public/model';
export * from './public/mixin';
export * as Types from './types';

import { writeFile } from 'fs/promises';
import * as Types from './types';
import codegen from './codegen';

export default (config: Types.Config) =>
  (({ schema, output, time }) =>
    writeFile(output, schema, 'utf8').then(() =>
      console.log(`Created schema at: ${output} (${time} ms)`),
    ))(codegen(config));
