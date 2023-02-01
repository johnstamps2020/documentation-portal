import { Column, Entity, JoinTable, ManyToMany, PrimaryColumn } from 'typeorm';
import { SubjectItem } from './SubjectItem';

@Entity()
export class Subject {
  @PrimaryColumn()
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
