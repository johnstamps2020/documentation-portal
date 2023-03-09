import { Entity, ManyToMany, PrimaryColumn } from 'typeorm';
import { Doc } from './Doc';
import { GwEntity } from './GwEntity';

@Entity()
export class Product extends GwEntity {
  @PrimaryColumn()
  name: string;

  @PrimaryColumn()
  version: string;

  @PrimaryColumn()
  platform: string;

  @ManyToMany(() => Doc, (doc) => doc.id)
  docs: Doc[];
}
