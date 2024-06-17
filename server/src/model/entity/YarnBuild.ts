import { Column, Entity } from 'typeorm';
import { Build } from './Build';

@Entity()
export class YarnBuild extends Build {
  @Column({ type: 'varchar', nullable: true })
  yarnBuildCustomCommand: string | null;

  @Column({ type: 'varchar', nullable: true })
  outputPath: string | null;

  @Column({ type: 'jsonb', nullable: true })
  customEnv: { name: string; value: string }[] | null;

  @Column({ type: 'varchar', nullable: true })
  nodeImageVersion: string | null;

  @Column({ type: 'varchar', nullable: true })
  workingDir: string | null;
}
