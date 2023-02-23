import { Column, Entity } from 'typeorm';

@Entity()
export class Page {
  @Column({ primary: true })
  path: string;

  @Column()
  title: string;

  @Column('text', { nullable: true })
  component: string | null;

  @Column('json', { nullable: true })
  searchFilters: { [key: string]: string[] };

  @Column()
  isInProduction: boolean;

  @Column({ default: false })
  public: boolean;

  @Column({ default: false })
  internal: boolean;

  @Column({ default: false })
  earlyAccess: boolean;
}
