import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateInruranceQuotes1744552985212 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "insurance_quotes"
      ADD COLUMN "serviceDetails" jsonb
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "insurance_quotes"
      DROP COLUMN "serviceDetails"
    `);
  }
}
