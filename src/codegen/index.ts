import * as Types from '../types';
import { performance } from 'perf_hooks';
import { block, header } from './block';
import { kv } from './transform';
import { column } from './column';
import { del, nonNullable } from '../types/utils';
import { dedent } from './lib/dedent';
import { validate } from '../types';
import { align } from './align';

type CodegenResult = { schema: string; time: number; output: string };

// Takes a Config input & returns a generated Prisma schema file as a string
// which can then be written to a file / formatted by Prisma CLI
export default (config: Types.Config): CodegenResult => {
  const start = performance.now();

  config = validate(config);

  const datasource = config.datasource;
  const generators = config.generators;
  const enums = config.schema.filter(Types.Blocks.isEnum);
  const models = config.schema.filter(Types.Blocks.isModel);

  const group = (header: string, blocks: string[]): string | null =>
    blocks.length == 0 ? null : [header, blocks.join('\n\n')].join('\n\n');

  const schema = dedent(
    [
      header('datasource'),
      block('datasource db', align(kv(datasource), '=')),

      group(
        header('generators'),
        generators.map(generator =>
          block(
            `generator ${generator.name}`,
            align(kv(del(generator, 'name')), '='),
          ),
        ),
      ),

      group(
        header('enums'),
        enums.map(e =>
          block(`enum ${e.name}`, e.columns.map(c => `\t${c.name}`).join('\n')),
        ),
      ),

      group(
        header('models'),
        models.map(model =>
          block(
            `model ${model.name}`,
            align(model.columns.map(column).join('\n')),
          ),
        ),
      ),
    ]
      .filter(nonNullable)
      .flat()
      .join('\n\n'),
  );

  const end = performance.now();
  const time = Number((end - start).toFixed(3));

  return {
    time,
    output: config.output,
    schema: [header(`refract 1.0.3 - generated in ${time} ms`), schema].join(
      '\n',
    ),
  };
};
