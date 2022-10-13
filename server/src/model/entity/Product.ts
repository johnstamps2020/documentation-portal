import {
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Doc } from './Doc';
import { ProductName } from './ProductName';
import { ProductVersion } from './ProductVersion';
import { ProductPlatform } from './ProductPlatform';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(
    () => ProductName,
    productName => productName.id,
    { eager: true }
  )
  @JoinTable()
  name: ProductName;

  @ManyToOne(
    () => ProductVersion,
    productVersion => productVersion.id,
    { eager: true }
  )
  @JoinTable()
  version: ProductVersion;

  @ManyToOne(
    () => ProductPlatform,
    productPlatform => productPlatform.id,
    { eager: true }
  )
  @JoinTable()
  platform: ProductPlatform;

  @ManyToMany(
    () => Doc,
    doc => doc.id
  )
  docs: Doc[];
}
