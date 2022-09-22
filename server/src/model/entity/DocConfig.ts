import { Entity, Column } from 'typeorm';

@Entity()
export class DocConfig {
  @Column({ primary: true, name: 'docId' })
  id: string;

  @Column()
  title: string;

  @Column()
  url: string;

  @Column('simple-json')
  metadata: string;

  @Column('simple-json')
  environments: string;

  @Column({ default: true })
  displayOnLandingPages: boolean;

  @Column({ default: true })
  indexForSearch: boolean;

  @Column({ default: false })
  public: boolean;

  @Column({ default: false })
  internal: boolean;

  @Column({ default: false })
  earlyAccess: boolean;
}
