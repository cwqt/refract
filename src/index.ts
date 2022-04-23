export * from './public/modifiers';
export * from './public/fields';
export * from './public/model';
export * from './public/mixin';

import { writeFile } from 'fs/promises';
import path from 'path';
import * as Types from './types';
import codegen from './codegen';

export default (config: Types.Config) =>
  (file =>
    writeFile(
      config.output || path.join(process.cwd(), 'schema.prisma'),
      file,
      'utf8',
    ))(codegen(config));
