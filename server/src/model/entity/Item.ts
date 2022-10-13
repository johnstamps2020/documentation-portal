import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Page } from './Page';
import { Doc } from './Doc';

@Entity()
export abstract class Item {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  label: string;

  @ManyToOne(() => Doc, { nullable: true, eager: true })
  @JoinTable()
  doc: Doc;

  @Column({ nullable: true })
  pagePath: string;

  @ManyToOne(() => Page, { nullable: true })
  @JoinColumn()
  page: Page;

  @Column('text', { nullable: true })
  link: string | null;
}
