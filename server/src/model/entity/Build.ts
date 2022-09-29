import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DocConfig } from './DocConfig';
import { Source } from './Source';
import { Resource } from './Resource';

@Entity()
export class Build {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  type: string;

  @ManyToOne(
    () => Source,
    source => source.id
  )
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

  @ManyToMany(
    () => Resource,
    resource => resource.id,
    { nullable: true }
  )
  @JoinTable()
  resources: Resource[];

  @Column({ nullable: true })
  yarnBuildCustomCommand: string;

  @Column({ nullable: true })
  outputPath: string;

  @Column({ nullable: true })
  zipFilename: string;

  @Column('simple-json', { nullable: true })
  customEnv: {
    name: string;
    value: string;
  };

  @OneToOne(
    () => DocConfig,
    docConfig => docConfig.build
  )
  docConfig: DocConfig;
}
