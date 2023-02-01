import { Column, Entity, JoinTable, ManyToMany, PrimaryColumn } from 'typeorm';
import { SubCategoryItem } from './SubCategoryItem';

@Entity()
export class SubCategory {
  @PrimaryColumn()
  id: string;

  @Column()
  label: string;

  @ManyToMany(
    () => SubCategoryItem,
    subCategoryItem => subCategoryItem.id,
    { nullable: true, eager: true }
  )
  @JoinTable()
  subCategoryItems: SubCategoryItem[];
}
