import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Doc } from './Doc';

export enum languageCode {
  'de-DE',
  'en-US',
  'es-419',
  'es-ES',
  'fr-FR',
  'it-IT',
  'ja-JP',
  'nl-NL',
  'pt-BR',
}

@Entity()
export class Locale {
  @PrimaryColumn({ type: 'enum', enum: languageCode })
  languageCode: languageCode;

  @Column()
  languageName: string;

  @OneToMany(
    () => Doc,
    doc => doc.id
  )
  doc: Doc;
}
