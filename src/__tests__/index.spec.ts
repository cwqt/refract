import { generate } from '../codegen';
import schema from './schema';

describe('refract', () => {
  it('should generate the schema', () => {
    const prisma = generate({
      datasource: {
        url: 'secret-url',
        provider: 'postgresql',
        shadowDatabaseUrl: 'secret-shadow-url',
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

    console.log(prisma);
  });
});
