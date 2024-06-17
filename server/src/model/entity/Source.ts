import { Column, Entity, Unique } from 'typeorm';
import { GwEntity } from './GwEntity';

@Entity()
@Unique(['id'])
export class Source extends GwEntity {
  @Column({ type: 'varchar' })
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  gitUrl: string;

  @Column({ type: 'varchar' })
  gitBranch: string;
}
