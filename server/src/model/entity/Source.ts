import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Build } from './Build';
import { integer } from '@elastic/elasticsearch/api/types';
import { Resource } from './Resource';

@Entity()
export class Source {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column()
  gitUrl: string;

  @Column()
  gitBranch: string;

  @Column('text', { array: true, nullable: true })
  xdocsPathIds: string[];

  @Column({ nullable: true })
  exportFrequency: string;

  @Column({ nullable: true })
  pollInterval: integer;

  @OneToMany(() => Build, (build) => build)
  build: Build;

  @OneToMany(() => Resource, (resource) => resource.id)
  resource: Resource;
}
