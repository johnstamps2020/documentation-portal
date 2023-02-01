import { Column, Entity, JoinTable, ManyToMany, PrimaryColumn } from 'typeorm';
import { SidebarItem } from './SidebarItem';

@Entity()
export class Sidebar {
  @PrimaryColumn()
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
