import * as Types from '../types';
import { performance } from 'perf_hooks';
import { block, header } from './block';
import { kv } from './transform';
import { column } from './column';
import { del, nonNullable } from '../types/utils';
import { dedent } from './lib/dedent';
import { Column, validate } from '../types';
import { alignFields, alignKv } from './align';
import { validateModel } from './validate';

type CodegenResult = { schema: string; time: number; output: string };

// Takes a Config input & returns a generated Prisma schema file as a string
// which can then be written to a file / formatted by Prisma CLI
export default (config: Types.Config): CodegenResult => {
  const start = performance.now();

  // Allow direct imports, e.g. `import * as schema from './foo'`
  const schema = Array.isArray(config.schema)
    ? config.schema
    : Object.values(config.schema);

  config = validate({ ...config, schema });

  const datasource = config.datasource;
  const generators = config.generators;
  const enums = schema.filter(Types.Blocks.isEnum);
  const models = schema.filter(Types.Blocks.isModel);

  const group = (header: string, blocks: string[]): string | null =>
    blocks.length == 0 ? null : [header, blocks.join('\n\n')].join('\n\n');

  const generated = dedent(
    [
      header('datasource'),
      block('datasource db', alignKv(kv(datasource))),

      group(
        header('generators'),
        generators.map(generator =>
          block(
            `generator ${generator.name}`,
            alignKv(kv(del(generator, 'name'))),
          ),
        ),
      ),

      group(
        header('enums'),
        enums.map(e =>
          block(
            `enum ${e.name}`,
            e.columns.map(e => column(e as Column)).join('\n'),
          ),
        ),
      ),

      group(
        header('models'),
        models.map(
          model => (
            validateModel(model, config),
            block(
              `model ${model.name}`,
              alignFields(model.columns.map(column).join('\n')),
            )
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
    schema: [
      header(
        `refract https://github.com/cwqt/refract - generated in ${time} ms`,
      ),
      generated,
    ].join('\n'),
  };
};
