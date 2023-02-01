import { Column, Entity, JoinTable, ManyToMany, PrimaryColumn } from 'typeorm';
import { SectionItem } from './SectionItem';

@Entity()
export class Section {
  @PrimaryColumn()
  id: string;

  @Column()
  label: string;

  @ManyToMany(
    () => SectionItem,
    sectionItem => sectionItem.id,
    { nullable: true, eager: true }
  )
  @JoinTable()
  sectionItems: SectionItem[];
}
