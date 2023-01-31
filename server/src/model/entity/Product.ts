import { Entity, ManyToMany, PrimaryColumn } from 'typeorm';
import { Doc } from './Doc';

@Entity()
export class Product {
  @PrimaryColumn()
  name: string;

  @PrimaryColumn()
  version: string;

  @PrimaryColumn()
  platform: string;

  @ManyToMany(
    () => Doc,
    doc => doc.id
  )
  docs: Doc[];
}
