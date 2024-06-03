import { Column, Entity, Index, Unique } from 'typeorm';
import { GwEntity } from './GwEntity';

@Entity()
@Unique(['url'])
export class ExternalLink extends GwEntity {
  @Column({ type: 'varchar' })
  @Index('externalLinkUrls-idx')
  url: string;

  @Column({ type: 'varchar' })
  label: string;
}
