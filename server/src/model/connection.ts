import { DataSource } from 'typeorm';
import { winstonLogger } from '../controllers/loggerController';
import {
  DitaBuild,
  Doc,
  ExternalLink,
  JustCopyBuild,
  Language,
  Page,
  Platform,
  PlatformProductVersion,
  Product,
  Release,
  Resource,
  Source,
  SourceZipBuild,
  Subject,
  Version,
  YarnBuild,
} from '@doctools/components';
import { runningInDevMode } from '../controllers/utils/serverUtils';

const dbHost = process.env.CONFIG_DB_HOST;
const isDevMode = runningInDevMode();

winstonLogger.notice(`Connecting to database at ${dbHost}.`);

if (isDevMode) {
  winstonLogger.warning('>>WARNING: Running in dev mode<<');
}

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: dbHost,
  port: 5432,
  database: process.env.CONFIG_DB_NAME,
  username: process.env.CONFIG_DB_USERNAME,
  password: process.env.CONFIG_DB_PASSWORD,
  entities: [
    DitaBuild,
    Doc,
    ExternalLink,
    JustCopyBuild,
    Language,
    Page,
    Platform,
    PlatformProductVersion,
    Product,
    Release,
    Resource,
    Source,
    SourceZipBuild,
    Subject,
    Version,
    YarnBuild,
  ],
  migrations: ['model/migration/*.js'],
  synchronize: isDevMode,
  cache: {
    duration: 3000, // 3 seconds
  },
});
