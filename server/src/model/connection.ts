import 'dotenv/config';
import { DataSource } from 'typeorm';
import { winstonLogger } from '../controllers/loggerController';
import { runningInDevMode } from '../controllers/utils/serverUtils';
import { DitaBuild } from './entity/DitaBuild';
import { Doc } from './entity/Doc';
import { ExternalLink } from './entity/ExternalLink';
import { JustCopyBuild } from './entity/JustCopyBuild';
import { Language } from './entity/Language';
import { Page } from './entity/Page';
import { Platform } from './entity/Platform';
import { PlatformProductVersion } from './entity/PlatformProductVersion';
import { Product } from './entity/Product';
import { Release } from './entity/Release';
import { Resource } from './entity/Resource';
import { Source } from './entity/Source';
import { SourceZipBuild } from './entity/SourceZipBuild';
import { Subject } from './entity/Subject';
import { Version } from './entity/Version';
import { YarnBuild } from './entity/YarnBuild';

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
