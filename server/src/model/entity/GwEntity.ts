import { Column } from 'typeorm';

export abstract class GwEntity {
  @Column({ default: false })
  public: boolean;

  @Column({ default: true })
  internal: boolean;

  @Column({ default: true })
  earlyAccess: boolean;

  @Column({ default: false })
  isInProduction: boolean;
}
