import { Column, Entity, JoinTable, ManyToMany, PrimaryColumn } from 'typeorm';
import { CategoryItem } from './CategoryItem';
import { SubCategory } from './SubCategory';

@Entity()
export class Category {
  @PrimaryColumn()
  id: string;

  @Column()
  label: string;

  @ManyToMany(
    () => CategoryItem,
    categoryItem => categoryItem.id,
    { nullable: true, eager: true }
  )
  @JoinTable()
  categoryItems: CategoryItem[];

  @ManyToMany(
    () => SubCategory,
    subCategory => subCategory.id,
    { nullable: true, eager: true }
  )
  @JoinTable()
  subCategories: SubCategory[];
}
