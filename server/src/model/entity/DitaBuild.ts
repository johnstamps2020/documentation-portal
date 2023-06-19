import { Column, Entity } from 'typeorm';
import { Build } from './Build';

@Entity()
export class DitaBuild extends Build {
  @Column({ type: 'varchar' })
  root: string;

  @Column({ type: 'boolean' })
  indexRedirect: boolean;

  @Column({ type: 'varchar', nullable: true })
  filter: string | null;
}
