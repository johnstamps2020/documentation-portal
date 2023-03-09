import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Doc } from './Doc';
import { GwEntity } from './GwEntity';

@Entity()
export class Locale extends GwEntity {
  @PrimaryColumn()
  languageCode: string;

  @Column()
  languageName: string;

  @OneToMany(() => Doc, (doc) => doc.id)
  doc: Doc;
}
