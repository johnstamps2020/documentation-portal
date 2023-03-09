import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Build } from './Build';
import { integer } from '@elastic/elasticsearch/api/types';
import { Resource } from './Resource';
import { GwEntity } from './GwEntity';

@Entity()
export class Source extends GwEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  gitUrl: string;

  @Column()
  gitBranch: string;

  @OneToMany(() => Build, (build) => build)
  build: Build;

  @OneToMany(() => Resource, (resource) => resource.id)
  resource: Resource;
}
