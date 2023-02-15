import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { PageSelector } from './PageSelector';
import { Category } from './Category';
import { Section } from './Section';
import { ProductFamilyItem } from './ProductFamilyItem';
import { Sidebar } from './Sidebar';

@Entity()
export class Page {
  @Column({ primary: true })
  path: string;

  @Column()
  title: string;

  @Column('text', { nullable: true })
  component: string | null;

  @ManyToOne(
    () => PageSelector,
    pageSelector => pageSelector.id,
    { nullable: true, eager: true }
  )
  @JoinTable()
  pageSelector: PageSelector;

  @Column('json', { nullable: true })
  searchFilters: { [key: string]: string[] };

  @ManyToOne(
    () => Sidebar,
    sidebar => sidebar.id,
    { nullable: true, eager: true }
  )
  @JoinTable()
  sidebar: Sidebar;

  @ManyToMany(
    () => Category,
    category => category.id,
    { nullable: true, eager: true }
  )
  @JoinTable()
  categories: Category[];

  @ManyToMany(
    () => Section,
    section => section.id,
    { nullable: true, eager: true }
  )
  @JoinTable()
  sections: Section[];

  @ManyToMany(
    () => ProductFamilyItem,
    productFamilyItem => productFamilyItem.id,
    { nullable: true, eager: true }
  )
  @JoinTable()
  productFamilyItems: ProductFamilyItem[];

  @Column()
  isInProduction: boolean;

  @Column({ default: false })
  public: boolean;

  @Column({ default: false })
  internal: boolean;

  @Column({ default: false })
  earlyAccess: boolean;
}
