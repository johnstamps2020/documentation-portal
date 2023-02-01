import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { Page } from './Page';
import { Doc } from './Doc';

@Entity()
export abstract class Item {
  @PrimaryColumn()
  id: string;

  @Column()
  label: string;

  @ManyToOne(() => Doc, { nullable: true })
  @JoinTable()
  doc: Doc;

  @ManyToOne(() => Page, { nullable: true })
  @JoinColumn()
  page: Page;

  @Column('text', { nullable: true })
  link: string | null;
}
