import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PageSelectorItem } from './PageSelectorItem';

@Entity()
export class PageSelector {
  @PrimaryGeneratedColumn('uuid')
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
