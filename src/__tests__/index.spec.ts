import codegen from '../codegen';
import schema from './schema';

describe('refract', () => {
  it('should generate the schema', () => {
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

    expect(
      prisma.replace(/generated in [\d.]* ms/, 'generated in x ms'),
    ).toMatchSnapshot();
  });
});
