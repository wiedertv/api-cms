import { config } from 'dotenv';
import { createConnection, Repository } from 'typeorm';
import { MailerSettingsEntity } from './database/entities/mailer-settings.entity';
import { Permissions } from './database/entities/permissions.entity';
import { mailerSettings } from './mailer-settings/mailer-settings.seed';
import { data } from './permissions/permissions.seed';
config();
const { DB_USER, DB_HOST, DB_PASSWORD, DB_NAME } = process.env;

const seed = async () => {
  const connection = await createConnection({
    database: DB_NAME,
    entities: [__dirname + '/../**/*.entity.{js,ts}'],
    host: DB_HOST,
    password: DB_PASSWORD,
    port: 5432,
    synchronize: true,
    type: 'postgres',
    username: DB_USER,
  });
  const promises = [];
  const repositoryP: Repository<Permissions> = connection.getRepository('Permissions');
  const repositoryMS: Repository<MailerSettingsEntity> = connection.getRepository('MailerSettingsEntity');
  for (const [name, allowed] of Object.entries(data.permissions)) {
    promises.push(repositoryP.save({ name, allowed }));
  }
  for (const [name, email] of Object.entries(mailerSettings)) {
    promises.push(repositoryMS.save({ name, email }));
  }
  await Promise.all(promises);
  process.exit(0);
};

seed();
