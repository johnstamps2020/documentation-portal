import { Column, Entity, Unique } from 'typeorm';
import { GwEntity } from './GwEntity';

@Entity()
@Unique(['url'])
export class ExternalLink extends GwEntity {
  @Column({ type: 'varchar' })
  url: string;

  @Column({ type: 'varchar' })
  label: string;
}
