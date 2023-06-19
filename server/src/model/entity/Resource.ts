import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { Source } from './Source';
import { GwEntity } from './GwEntity';

@Entity()
@Unique(['id'])
export class Resource extends GwEntity {
  @Column({ type: 'varchar' })
  id: string;

  @Column({ type: 'varchar' })
  sourceFolder: string;

  @Column({ type: 'varchar' })
  targetFolder: string;

  @ManyToOne(() => Source, (source) => source.uuid)
  @JoinColumn()
  source: Source;
}
