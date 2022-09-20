import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PageItem {
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
}
