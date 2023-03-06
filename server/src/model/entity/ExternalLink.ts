import { Column, Entity } from 'typeorm';

@Entity()
export class ExternalLink {
  @Column({ primary: true })
  url: string;

  @Column()
  label: string;

  @Column()
  isInProduction: boolean;

  @Column({ default: false })
  public: boolean;

  @Column({ default: false })
  internal: boolean;

  @Column({ default: false })
  earlyAccess: boolean;
}
