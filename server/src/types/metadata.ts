import { Product } from '../model/entity/Product';
import { Platform } from './platform';
import { Subject } from './subject';
import { Version } from './version';

export type Metadata = {
  product: Product[];
  platform: Platform[];
  version: Version[];
  subject: Subject[];
};
