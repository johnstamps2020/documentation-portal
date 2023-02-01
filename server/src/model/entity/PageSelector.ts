import { Column, Entity, JoinTable, ManyToMany, PrimaryColumn } from 'typeorm';
import { PageSelectorItem } from './PageSelectorItem';

@Entity()
export class PageSelector {
  @PrimaryColumn()
  id: string;

  @Column()
  label: string;

  @Column({ nullable: true })
  selectedItemLabel: string;

  @ManyToMany(
    () => PageSelectorItem,
    pageSelectorItem => pageSelectorItem.id,
    { eager: true }
  )
  @JoinTable()
  pageSelectorItems: PageSelectorItem[];
}
