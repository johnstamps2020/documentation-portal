import { DataSource } from 'typeorm';
import { winstonLogger } from '../controllers/loggerController';
import { PageItem } from './entity/PageItem';
import { DocConfig } from './entity/DocConfig';
import { PageConfig } from './entity/PageConfig';
import { PageSelector } from './entity/PageSelector';
import { Product } from './entity/Product';
import { Release } from './entity/Release';
import { VersionSelector } from './entity/VersionSelector';

const dbHost = process.env.DOCPORTAL_DB_HOST;
const willSynchronize = process.env.NODE_ENV === 'development';

winstonLogger.notice(
  `Connecting to database ${dbHost}. Will synchronize: >>${willSynchronize}<<`
);

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: dbHost,
  port: 5432,
  username: 'postgres',
  password: process.env.DOCPORTAL_DB_PASSWORD,
  database: 'postgres',
  entities: [
    DocConfig,
    PageConfig,
    PageItem,
    PageSelector,
    Product,
    Release,
    VersionSelector,
  ],
  synchronize: willSynchronize,
});
