import { Column, Entity, PrimaryGeneratedColumn, TreeParent } from 'typeorm';

@Entity()
export class Release {
  @PrimaryGeneratedColumn('uuid')
  releaseId: string;

  @Column()
  releaseLabel: string;
}
