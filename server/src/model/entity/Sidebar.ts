import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SidebarItem } from './SidebarItem';

@Entity()
export class Sidebar {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  label: string;

  @ManyToMany(
    () => SidebarItem,
    sidebarItem => sidebarItem.id,
    { eager: true }
  )
  @JoinTable()
  sidebarItems: SidebarItem[];

}
