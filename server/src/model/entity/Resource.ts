import {
  Column,
  Entity,
  JoinTable,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Source } from './Source';

@Entity()
export class Resource {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  sourceFolder: string;

  @Column()
  targetFolder: string;

  @ManyToOne(
    () => Source,
    source => source.id
  )
  @JoinTable()
  source: Source;
}
