import { Column, Entity, Unique } from 'typeorm';
import { GwEntity } from './GwEntity';

@Entity()
@Unique(['code'])
export class Language extends GwEntity {
  @Column({ type: 'varchar' })
  code: string;

  @Column({ type: 'varchar' })
  label: string;
}
