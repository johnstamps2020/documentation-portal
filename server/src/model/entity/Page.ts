import { Column, Entity } from 'typeorm';
import { GwEntity } from './GwEntity';

@Entity()
export class Page extends GwEntity {
  @Column({ primary: true })
  path: string;

  @Column()
  title: string;

  @Column('text', { nullable: true })
  component: string | null;

  @Column('json', { nullable: true })
  searchFilters: { [key: string]: string[] };
}
