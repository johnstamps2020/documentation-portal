import { Entity, Column, Tree, TreeChildren } from 'typeorm';
import { Environment } from '../../types/environment';

@Entity()
@Tree('closure-table')
export class DocConfig {
  @Column({ primary: true })
  id: string;

  @Column()
  title: string;

  @Column()
  url: string;

  @Column('json')
  metadata: string;

  @TreeChildren()
  environments: Environment[];

  @Column()
  displayOnLandingPages: boolean;

  @Column()
  indexForSearch: boolean;

  @Column()
  public: boolean;

  @Column()
  internal: boolean;

  @Column()
  earlyAccess: boolean;
}
