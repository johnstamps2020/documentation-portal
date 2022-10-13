import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SubjectItem } from './SubjectItem';

@Entity()
export class Subject {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  label: string;

  @ManyToMany(
    () => SubjectItem,
    subjectItem => subjectItem.id,
    { nullable: true, eager: true }
  )
  @JoinTable()
  subjectItems: SubjectItem[];
}
