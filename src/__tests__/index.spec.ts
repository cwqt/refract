import codegen from '../codegen';
import schema from './schema';
// import { readFile } from 'fs/promises';
// import path from 'path';
// import { diffLines } from 'diff';

describe('refract', () => {
  it('should generate the schema', async () => {
    // const mock = await readFile(
    //   path.join(process.cwd(), 'src', '__tests__', 'schema.mock.prisma'),
    // ).then(file => file.toString('utf8'));

    const { schema: prisma } = codegen({
      datasource: {
        url: 'env("DATABASE_URL")',
        provider: 'postgresql',
        shadowDatabaseUrl: 'env("DATABASE_SHADOW_URL")',
        referentialIntegrity: 'prisma',
      },
      generators: [
        {
          name: 'client',
          provider: 'prisma-client-js',
          binaryTargets: [
            'native',
            'rhel-openssl-1.0.x',
            'linux-arm64-openssl-1.0.x',
            'darwin-arm64',
          ],
          previewFeatures: ['referentialIntegrity'],
        },
      ],
      schema,
    });

    // TODO: using diffing library to assert correctness
    // const diff = diffLines(prisma, mock, {
    //   ignoreWhitespace: true,
    //   ignoreCase: true,
    // });
    //
    // console.log(diff);

    console.log(prisma);
  });
});
