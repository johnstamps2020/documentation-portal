import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { Doc } from './Doc';
import { Source } from './Source';
import { Resource } from './Resource';

export enum BuildType {
  DITA = 'dita',
  SOURCE_ZIP = 'source-zip',
  STORYBOOK = 'storybook',
  YARN = 'yarn',
  JUST_COPY = 'just-copy',
}

@Entity()
export class Build {
  @PrimaryColumn()
  id: string;

  @Column()
  type: string;

  @ManyToOne(() => Source, (source) => source.id, { eager: true })
  @JoinTable()
  source: Source;

  @Column({ nullable: true })
  root: string;

  @Column({ nullable: true })
  filter: string;

  @Column({ nullable: true })
  indexRedirect: boolean;

  @Column({ nullable: true })
  nodeImageVersion: string;

  @Column({ nullable: true })
  workingDir: string;

  @ManyToMany(() => Resource, (resource) => resource.id, {
    eager: true,
    nullable: true,
  })
  @JoinTable()
  resources: Resource[];

  @Column({ nullable: true })
  yarnBuildCustomCommand: string;

  @Column({ nullable: true })
  outputPath: string;

  @Column({ nullable: true })
  zipFilename: string;

  @Column('json', { nullable: true })
  customEnv: { name: string; value: string }[];

  @OneToOne(() => Doc, (doc) => doc.build)
  doc: Doc;
}
