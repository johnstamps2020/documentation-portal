import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Tree,
  TreeChildren,
} from 'typeorm';
import { PageItem } from './PageItem';

@Entity()
@Tree('closure-table')
export class PageSelector {
  @PrimaryGeneratedColumn()
  selectorId: number;

  @Column()
  label: string;

  @Column()
  class: string;

  @TreeChildren()
  selectedItem: PageItem;

  @TreeChildren()
  items: PageItem[];
}
