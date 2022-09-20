import { Entity, Column, Tree, TreeChildren } from 'typeorm';
import { Environment } from '../../types/environment';
import { Metadata } from '../../types/metadata';

@Entity()
@Tree('closure-table')
export class DocConfig {
  @Column({ primary: true })
  id: string;

  @Column()
  title: string;

  @Column()
  url: string;

  @TreeChildren()
  metadata: Metadata;

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
