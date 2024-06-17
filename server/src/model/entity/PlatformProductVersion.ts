import { Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { GwEntity } from './GwEntity';
import { Product } from './Product';
import { Platform } from './Platform';
import { Version } from './Version';

@Entity()
@Unique(['platform', 'product', 'version'])
export class PlatformProductVersion extends GwEntity {
  @ManyToOne(() => Platform, (platform) => platform.uuid, { nullable: false })
  @JoinColumn()
  platform: Platform;

  @ManyToOne(() => Product, (product) => product.uuid, { nullable: false })
  @JoinColumn()
  product: Product;

  @ManyToOne(() => Version, (version) => version.uuid, { nullable: false })
  @JoinColumn()
  version: Version;
}
