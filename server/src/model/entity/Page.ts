import { Column, Entity, Unique } from 'typeorm';
import { GwEntity } from './GwEntity';
import { SearchFilters } from '../../types/config';

@Entity()
@Unique(['path'])
export class Page extends GwEntity {
  @Column({ type: 'varchar' })
  path: string;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'jsonb', nullable: true })
  searchFilters: SearchFilters | null;
}
