import { DataSource } from 'typeorm';
import { winstonLogger } from '../controllers/loggerController';
import { Doc } from './entity/Doc';
import { Product } from './entity/Product';
import { runningInDevMode } from '../controllers/utils/serverUtils';
import { Build } from './entity/Build';
import { Release } from './entity/Release';
import { Resource } from './entity/Resource';
import { Source } from './entity/Source';
import { Page } from './entity/Page';
import { Subject } from './entity/Subject';
import { ExternalLink } from './entity/ExternalLink';
import { Locale } from './entity/Locale';

const dbHost = process.env.CONFIG_DB_HOST;
const isDevMode = runningInDevMode();

winstonLogger.notice(
  `Connecting to database at ${dbHost}.${
    isDevMode && ' >>WARNING: Running in dev mode<<'
  }`
);

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: dbHost,
  port: 5432,
  database: process.env.CONFIG_DB_NAME,
  username: process.env.CONFIG_DB_USERNAME,
  password: process.env.CONFIG_DB_PASSWORD,
  entities: [
    Build,
    Doc,
    Product,
    Release,
    Subject,
    Resource,
    Source,
    Page,
    ExternalLink,
    Locale
  ],
  synchronize: isDevMode,
  cache: {
    duration: 3000, // 3 seconds
  },
});
