import { DataSource } from 'typeorm';
import { winstonLogger } from '../controllers/loggerController';
import { Doc } from './entity/Doc';
import { Product } from './entity/Product';
import { runningInDevMode } from '../controllers/utils/serverUtils';
import { Build } from './entity/Build';
import { Release } from './entity/Release';
import { Resource } from './entity/Resource';
import { Source } from './entity/Source';
import { ProductPlatform } from './entity/ProductPlatform';
import { ProductName } from './entity/ProductName';
import { ProductVersion } from './entity/ProductVersion';
import { Page } from './entity/Page';
import { PageSelector } from './entity/PageSelector';
import { Category } from './entity/Category';
import { CategoryItem } from './entity/CategoryItem';
import { Item } from './entity/Item';
import { SubCategory } from './entity/SubCategory';
import { SubCategoryItem } from './entity/SubCategoryItem';
import { Subject } from './entity/Subject';
import { SubjectItem } from './entity/SubjectItem';
import { ProductFamilyItem } from './entity/ProductFamilyItem';
import { PageSelectorItem } from './entity/PageSelectorItem';
import { SidebarItem } from './entity/SidebarItem';
import { Sidebar } from './entity/Sidebar';

const dbHost = process.env.DOCPORTAL_DB_HOST;
const isDevMode = runningInDevMode();

winstonLogger.notice(
  `Connecting to database at ${dbHost}.${isDevMode &&
    ' >>WARNING: Running in dev mode<<'}`
);

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: dbHost,
  port: 5432,
  username: 'postgres',
  password: process.env.DOCPORTAL_DB_PASSWORD,
  database: 'postgres',
  entities: [
    Build,
    Doc,
    Product,
    ProductName,
    ProductPlatform,
    ProductVersion,
    Release,
    Resource,
    Source,
    Page,
    PageSelector,
    PageSelectorItem,
    Item,
    Category,
    CategoryItem,
    SubCategory,
    SubCategoryItem,
    Subject,
    SubjectItem,
    ProductFamilyItem,
    Sidebar,
    SidebarItem,
  ],
  synchronize: isDevMode,
  cache: {
    duration: 3000, // 3 seconds
  },
});
