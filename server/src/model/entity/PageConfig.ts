import { Column, Entity, Tree, TreeChildren } from 'typeorm';
import { Metadata } from '../../types/metadata';
import { PageItem } from './PageItem';
import { PageSelector } from './PageSelector';

@Entity()
@Tree('closure-table')
export class PageConfig {
  @Column({ primary: true })
  url: string;

  @Column()
  title: string;

  @Column()
  template: string;

  @Column()
  class: string;

  @Column()
  includeInBreadcrumbs: boolean;

  @TreeChildren()
  selector: PageSelector;

  @TreeChildren()
  search_filters: Metadata;

  @TreeChildren()
  items: PageItem[];
}
