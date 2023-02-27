import { Entity, ManyToMany, PrimaryColumn } from 'typeorm';
import { Doc } from './Doc';

@Entity()
export class Subject {
  @PrimaryColumn()
  name: string;

  @ManyToMany(() => Doc, (doc) => doc.id)
  doc: Doc[];
}
