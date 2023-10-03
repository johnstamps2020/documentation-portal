import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDisplayTitleToDocEntity implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "doc" ADD "displayTitle" character varying`
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "doc" DROP COLUMN "displayTitle"`);
  }
}
