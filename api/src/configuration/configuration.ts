import { TypeOrmModuleOptions } from '@nestjs/typeorm'

export default () => {
  return {
    port: process.env.PORT,
    uri: process.env.DASHBOARD_URL,
    maltaPublic: process.env.LANDING_URL,
    BannerButton: 'https://colabora.ordendemalta.es/hazte-amigo/',
    mailto: 'comunicacion@ordendemalta.es',
    sendgrid: {
      key: process.env.SENDGRID_KEY,
      from: 'Orden de Malta – España <comunicacion@ordendemalta.es>'
    },
    s3: {
      region: process.env.S3_REGION,
      secret_key: process.env.S3_SECRET_KEY,
      public_key: process.env.S3_PUBLIC_KEY,
      bucket: process.env.S3_BUCKET
    },
    auth: {
      salt: 8,
      privateKey: process.env.AUTH_PRIVATE_KEY,
      publicKey: process.env.AUTH_PUBLIC_KEY,
      options: {
        algorithm: 'HS256',
        expiresIn: '5h',
        issuer: 'Aluxion - malta - api',
        audience: 'malta - frontend'
      }
    },
    graphql: {
      debug: true
    },
    typeorm: {
      type: 'postgres',
      username: process.env.DB_USER,
      host: process.env.DB_HOST,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: 5432,
      entities: [__dirname + '/../**/*.entity.{js,ts}'],
      synchronize: true,
      logging: process.env.NODE_ENV !== 'Production'
    } as TypeOrmModuleOptions
  }
}
