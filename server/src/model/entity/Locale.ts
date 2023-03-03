import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Doc } from './Doc';


@Entity()
export class Locale {
  @PrimaryColumn()
  languageCode: string;

  @Column()
  languageName: string;

  @OneToMany(
    () => Doc,
    doc => doc.id
  )
  doc: Doc;
}
