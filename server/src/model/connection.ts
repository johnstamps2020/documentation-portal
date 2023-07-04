import { DataSource } from 'typeorm';
import { winstonLogger } from '../controllers/loggerController';
import { Doc } from './entity/Doc';
import { PlatformProductVersion } from './entity/PlatformProductVersion';
import { runningInDevMode } from '../controllers/utils/serverUtils';
import { Build } from './entity/Build';
import { Release } from './entity/Release';
import { Resource } from './entity/Resource';
import { Source } from './entity/Source';
import { Page } from './entity/Page';
import { Subject } from './entity/Subject';
import { ExternalLink } from './entity/ExternalLink';
import { Locale } from './entity/Locale';
import { Platform } from './entity/Platform';
import { Product } from './entity/Product';
import { Version } from './entity/Version';
import { DitaBuild } from './entity/DitaBuild';
import { YarnBuild } from './entity/YarnBuild';
import { JustCopyBuild } from './entity/JustCopyBuild';
import { SourceZipBuild } from './entity/SourceZipBuild';

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
    Locale,
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
  synchronize: isDevMode,
  cache: {
    duration: 3000, // 3 seconds
  },
});
