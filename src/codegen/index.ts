import * as Types from '../types';
import { performance } from 'perf_hooks';
import { block, header } from './block';
import { kv } from './transform';
import { column } from './column';
import { del, nonNullable } from '../types/utils';
import { dedent } from './dedent';
import { validate } from '../types';

// Takes a Config input & returns a generated Prisma schema file as a string
// which can then be written to a file / formatted by Prisma CLI
export default (config: Types.Config): string => {
  const start = performance.now();

  validate(config);

  config.schema = config.schema.map(
    model => (['Field', 'Relation'].forEach(v => del(model, v)), model),
  );

  const enums = config.schema.filter(Types.Blocks.isEnum);
  const models = config.schema.filter(Types.Blocks.isModel);
  const generators = config.generators;
  const datasource = config.datasource;

  const schema = dedent(
    [
      header('datasource'),
      block('datasource db', kv(datasource)),

      generators.length
        ? [
            header('generators'),
            config.generators
              .map(generator =>
                block(
                  `generator ${generator.name}`,
                  kv(del(generator, 'name')),
                ),
              )
              .join('\n'),
          ]
        : null,

      enums.length
        ? [
            header('enums'),
            enums
              .map(e =>
                block(
                  `enum ${e.name}`,
                  e.columns.map(c => `\t${c.name}`).join(',\n'),
                ),
              )
              .join('\n\n'),
          ]
        : null,

      models.length
        ? [
            header('models'),
            models
              .map(model =>
                block(
                  `model ${model.name}`,
                  model.columns.map(column).join('\n'),
                ),
              )
              .join('\n\n'),
          ]
        : null,
    ]
      .filter(nonNullable)
      .flat()
      .join('\n\n'),
  );

  const end = performance.now();

  return [
    header(`refract 1.0.1 - generated in ${(end - start).toFixed(3)} ms`),
    schema,
  ].join('\n');
};
