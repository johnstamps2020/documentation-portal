import { GwEntity } from './GwEntity';
import { Product } from './Product';
import { Platform } from './Platform';
import { Version } from './Version';

export class PlatformProductVersion extends GwEntity {
  platform!: Platform;
  product!: Product;
  version!: Version;
}
