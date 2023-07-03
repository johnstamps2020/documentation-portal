import { Column, Entity } from 'typeorm';
import { Build } from './Build';

@Entity()
export class SourceZipBuild extends Build {
  @Column({ type: 'varchar' })
  zipFilename: string;
}
