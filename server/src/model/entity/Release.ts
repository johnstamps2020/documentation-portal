import { Column, Entity, Unique } from 'typeorm';
import { GwEntity } from './GwEntity';

@Entity()
@Unique(['name'])
export class Release extends GwEntity {
  @Column({ type: 'varchar' })
  name: string;
}
