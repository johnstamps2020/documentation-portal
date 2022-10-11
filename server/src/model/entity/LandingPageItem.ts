import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Tree,
  TreeChildren,
} from 'typeorm';
import { Environment } from '../../types/environment';

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

  @Column()
  env: Environment;
}
