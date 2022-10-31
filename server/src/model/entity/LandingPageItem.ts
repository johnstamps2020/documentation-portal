import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Tree,
  TreeChildren,
} from 'typeorm';

@Entity()
@Tree('closure-table')
export class LandingPageItem {
  @PrimaryGeneratedColumn('uuid')
  itemId: number;

  @Column()
  class: string;

  @Column()
  label: string;

  @Column()
  id: string;

  @Column()
  page: string;

  @Column()
  link: string;

  @TreeChildren()
  items: LandingPageItem[];

  @Column('text', { array: true })
  env: string[];
}
