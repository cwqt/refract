import * as Types from '../types';
import { block, header } from './block';
import { kv } from './transform';
import { column } from './column';
import { del } from '../types/utils';
import { dedent } from './dedent';

// Takes a Config input & returns a generated Prisma schema file as a string
// which can then be written to a file / formatted by Prisma CLI
export default (config: Types.Config): string => {
  config.schema = config.schema.map(
    model => (['Field', 'Relation'].forEach(v => del(model, v)), model),
  );

  return dedent`
    ${header(`refract - ${process.env.npm_package_version}`)}
    ${header('datasource')}
    ${block('database db', kv(config.datasource))}

    ${header('generators')}
    ${config.generators
      .map(generator =>
        block(`generator ${generator.name}`, kv(del(generator, 'name'))),
      )
      .join('\n')}

    ${header('enums')}
    ${config.schema
      .filter(Types.Blocks.isEnum)
      .map(e =>
        block(`enum ${e.name}`, e.columns.map(c => `\t${c.name}`).join(',\n')),
      )
      .join('\n\n')}

    ${header('models')}
    ${config.schema
      .filter(Types.Blocks.isModel)
      .map(model =>
        block(`model ${model.name}`, model.columns.map(column).join('\n')),
      )
      .join('\n\n')}
`;
};
