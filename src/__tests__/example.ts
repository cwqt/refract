import Refract, {
  Boolean, DateTime, Default,
  Enum,
  Fields, Id,
  Int,
  Key, ManyToOne, Mixin,
  Model,
  MySql as db,
  Nullable, OneToMany, References,
  String,
  Unique, UpdatedAt,
  Types
} from '..';

const datasource: Types.Config["datasource"] = { provider: "mysql", url: 'env("URL")' }
const generators: Types.Config['generators'] = [
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
];










const Base = Mixin()
  .Field("id",        Int(Id, Default("autoincrement()")))
  .Field("createdAt", DateTime(Default("now()")))
  .Field("updatedAt", DateTime(Default("now()"), UpdatedAt));

const User = Model("User").Mixin(Base);
const Post = Model("Post").Mixin(Base);

const Role = Enum("Role", Key("USER"), Key("ADMIN"));

User
  .Field("email",    String(Unique))
  .Field("name",     String(Nullable))
  .Field("role",     Role("USER"))
  .Relation("posts", OneToMany(Post));

Post
  .Field("published", Boolean(Default(false)))
  .Field("title",     String(db.VarChar(255)))
  .Relation("author", ManyToOne(User, Fields("authorId"), References("id"), Nullable))
  .Field("authorId",  Int(Nullable));


Refract({ schema: [User, Post, Role], datasource, generators })











