import { Column, PrimaryGeneratedColumn } from 'typeorm';

export abstract class GwEntity {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({ type: 'boolean', default: true })
  public: boolean;

  @Column({ type: 'boolean', default: false })
  internal: boolean;

  @Column({ type: 'boolean', default: false })
  earlyAccess: boolean;

  @Column({ type: 'boolean', default: true })
  isInProduction: boolean;
}
