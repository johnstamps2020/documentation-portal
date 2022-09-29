import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { DocConfig } from './DocConfig';

@Entity()
export class Release {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToMany(
    () => DocConfig,
    docConfig => docConfig.id
  )
  docConfig: DocConfig[];
}
