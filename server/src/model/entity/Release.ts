import { Entity, ManyToMany, PrimaryColumn } from 'typeorm';
import { Doc } from './Doc';
import { GwEntity } from './GwEntity';

@Entity()
export class Release extends GwEntity {
  @PrimaryColumn()
  name: string;

  @ManyToMany(() => Doc, (doc) => doc.id)
  doc: Doc[];
}
