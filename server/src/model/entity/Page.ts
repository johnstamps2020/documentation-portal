import { Column, Entity, Unique } from 'typeorm';
import { GwEntity } from './GwEntity';

@Entity()
@Unique(['path'])
export class Page extends GwEntity {
  @Column({ type: 'varchar' })
  path: string;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'varchar', nullable: true })
  component: string | null;

  @Column({ type: 'jsonb', nullable: true })
  searchFilters: { [key: string]: string[] } | null;
}
