import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SubCategoryItem } from './SubCategoryItem';

@Entity()
export class SubCategory {
  @PrimaryGeneratedColumn('uuid')
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
