import {
  Column,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { Product } from './Product';
import { Build } from './Build';
import { Release } from './Release';
import { Subject } from './Subject';

@Entity()
export class Doc {
  @PrimaryColumn()
  id: string;

  @Column()
  title: string;

  @Column()
  @Index('docUrls-idx')
  url: string;

  @Column({ nullable: true })
  body: string;

  @ManyToMany(() => Product, (product) => product, { eager: true })
  @JoinTable()
  products: Product[];

  @OneToOne(() => Build, (build) => build.id, { eager: true })
  @JoinColumn()
  build: Build;

  @ManyToMany(() => Release, (release) => release.name, {
    eager: true,
    nullable: true,
  })
  @JoinTable()
  releases: Release[];

  @ManyToMany(() => Subject, (subject) => subject.name, {
    eager: true,
    nullable: true,
  })
  @JoinTable()
  subjects: Subject[];

  @Column()
  isInProduction: boolean;

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
