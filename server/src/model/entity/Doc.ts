import {
  Column,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { Product } from './Product';
import { Build } from './Build';
import { Release } from './Release';
import { Subject } from './Subject';
import { Locale } from './Locale';
import { GwEntity } from './GwEntity';

@Entity()
export class Doc extends GwEntity {
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

  @Column({ default: true })
  displayOnLandingPages: boolean;

  @Column({ default: true })
  indexForSearch: boolean;

  @ManyToOne(() => Locale, (locale) => locale.languageCode, { eager: true })
  @JoinTable()
  locales: Locale[];
}
