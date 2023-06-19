import { Column, PrimaryGeneratedColumn } from 'typeorm';

export abstract class GwEntity {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({ type: 'boolean', default: false })
  public: boolean;

  @Column({ type: 'boolean', default: false })
  internal: boolean;

  @Column({ type: 'boolean', default: false })
  earlyAccess: boolean;

  @Column({ type: 'boolean', default: false })
  isInProduction: boolean;
}
