import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCreatedbyRelationToInsuranceQuotes1743613800253 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "insurance_quotes"
      ADD COLUMN "created_by" uuid
    `);

    await queryRunner.query(`
      ALTER TABLE "insurance_quotes"
      ADD CONSTRAINT "FK_insurance_quotes_created_by"
      FOREIGN KEY ("created_by") REFERENCES "users"("id")
      ON DELETE SET NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "insurance_quotes"
      DROP CONSTRAINT "FK_insurance_quotes_created_by"
    `);

    await queryRunner.query(`
      ALTER TABLE "insurance_quotes"
      DROP COLUMN "created_by"
    `);
  }
}
