import { Column, Entity, JoinTable, ManyToOne, PrimaryColumn } from 'typeorm';
import { Source } from './Source';
import { GwEntity } from './GwEntity';

@Entity()
export class Resource extends GwEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  sourceFolder: string;

  @Column()
  targetFolder: string;

  @ManyToOne(() => Source, (source) => source.id, { eager: true })
  @JoinTable()
  source: Source;
}
