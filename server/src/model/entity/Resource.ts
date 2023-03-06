import { Column, Entity, JoinTable, ManyToOne, PrimaryColumn } from 'typeorm';
import { Source } from './Source';

@Entity()
export class Resource {
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
