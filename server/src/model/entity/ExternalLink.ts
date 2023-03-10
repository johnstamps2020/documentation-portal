import { Column, Entity } from 'typeorm';
import { GwEntity } from './GwEntity';

@Entity()
export class ExternalLink extends GwEntity {
  @Column({ primary: true })
  url: string;

  @Column()
  label: string;
}
