import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
  Unique,
} from 'typeorm';
import { Doc } from './Doc';
import { Source } from './Source';
import { Resource } from './Resource';
import { GwEntity } from './GwEntity';

@Entity()
@Unique(['id'])
export abstract class Build extends GwEntity {
  @Column({ type: 'varchar' })
  id: string;

  @Column({ type: 'boolean' })
  disabled: boolean;

  @Column({ type: 'boolean', nullable: true })
  createTranslationKit: boolean | null;

  @OneToOne(() => Doc, (doc) => doc.uuid, { nullable: false })
  @JoinColumn()
  doc: Doc;

  @ManyToOne(() => Source, (source) => source.uuid, { nullable: false })
  @JoinColumn()
  source: Source;

  @ManyToMany(() => Resource, (resource) => resource.uuid, { nullable: true })
  @JoinTable()
  resources: Resource[] | null;
}
