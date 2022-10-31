import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Tree,
  TreeChildren,
} from 'typeorm';
import { Release } from './Release';

@Entity()
@Tree('closure-table')
export class VersionObject {
  @PrimaryGeneratedColumn('uuid')
  versionObjectId: string;

  @TreeChildren()
  versions: string[];

  @TreeChildren()
  releases: Release[];

  @Column()
  url: string;

  @Column()
  currentlySelected: boolean;

  @Column()
  label: string;
}

@Entity()
@Tree('closure-table')
export class VersionSelector {
  @Column({ primary: true })
  docId: string;

  @TreeChildren()
  allVersions: VersionObject[];
}
