import { Column, Entity, Index, JoinTable, ManyToMany, Unique } from 'typeorm';
import { PlatformProductVersion } from './PlatformProductVersion';
import { Release } from './Release';
import { Subject } from './Subject';
import { Locale } from './Locale';
import { GwEntity } from './GwEntity';

@Entity()
@Unique(['id', 'url'])
export class Doc extends GwEntity {
  @Column({ type: 'varchar' })
  id: string;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'varchar' })
  @Index('docUrls-idx')
  url: string;

  @Column({ type: 'boolean' })
  displayOnLandingPages: boolean;

  @Column({ type: 'boolean' })
  indexForSearch: boolean;

  @Column({ type: 'varchar', nullable: true })
  body: string | null;

  @ManyToMany(
    () => PlatformProductVersion,
    (platform_product_version) => platform_product_version.uuid
  )
  @JoinTable()
  platformProductVersions: PlatformProductVersion[];

  @ManyToMany(() => Locale, (locale) => locale.uuid)
  @JoinTable()
  locales: Locale[];

  @ManyToMany(() => Release, (release) => release.uuid, { nullable: true })
  @JoinTable()
  releases: Release[] | null;

  @ManyToMany(() => Subject, (subject) => subject.uuid, { nullable: true })
  @JoinTable()
  subjects: Subject[] | null;
}
