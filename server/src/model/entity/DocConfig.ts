import {
  Column,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToOne,
} from 'typeorm';
import { Product } from './Product';
import { Build } from './Build';
import { Release } from './Release';

@Entity()
export class DocConfig {
  @Column({ primary: true })
  id: string;

  @Column()
  title: string;

  @Column()
  @Index('docUrls-idx')
  url: string;

  @Column({ nullable: true })
  body: string;

  @ManyToMany(
    () => Product,
    product => product.id
  )
  @JoinTable()
  products: Product[];

  @OneToOne(
    () => Build,
    build => build.docConfig
  )
  @JoinColumn()
  build: Build;

  @ManyToMany(
    () => Release,
    release => release.id
  )
  @JoinTable()
  releases: Release[];

  @Column('simple-array')
  environments: string[];

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
