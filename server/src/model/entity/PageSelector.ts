import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Tree,
  TreeChildren,
} from 'typeorm';
import { LandingPageItem } from './LandingPageItem';

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
  selectedItem: LandingPageItem;

  @TreeChildren()
  items: LandingPageItem[];
}
