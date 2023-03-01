import { Entity, ManyToMany, PrimaryColumn } from 'typeorm';
import { Doc } from './Doc';

export enum Platform {
  CLOUD = 'Cloud',
  SELF_MANAGED = 'Self-managed',
}

@Entity()
export class Product {
  @PrimaryColumn()
  name: string;

  @PrimaryColumn()
  version: string;

  @PrimaryColumn({
    type: 'enum',
    enum: Platform,
  })
  platform: string;

  @ManyToMany(
    () => Doc,
    doc => doc.id
  )
  docs: Doc[];
}
