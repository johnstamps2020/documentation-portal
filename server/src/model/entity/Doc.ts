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
export class Doc {
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
    product => product.id,
    { eager: true }
  )
  @JoinTable()
  products: Product[];

  @OneToOne(
    () => Build,
    build => build.doc,
    { eager: true }
  )
  @JoinColumn()
  build: Build;

  @ManyToMany(
    () => Release,
    release => release.id,
    { eager: true, nullable: true }
  )
  @JoinTable()
  releases: Release[] | null;

  @Column('text', { array: true })
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

  @Column({ array: true, nullable: true })
  subjects: string;

  @Column({ array: true, nullable: true })
  categories: string;
}
