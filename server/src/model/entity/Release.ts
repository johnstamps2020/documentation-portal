import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Doc } from './Doc';

@Entity()
export class Release {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToMany(
    () => Doc,
    doc => doc.id
  )
  doc: Doc[];
}
