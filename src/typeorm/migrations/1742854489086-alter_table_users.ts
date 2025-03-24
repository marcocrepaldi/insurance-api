import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterTableUsers1742854489086 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "users"
      RENAME COLUMN "role" TO "role_id";
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "users"
      RENAME COLUMN "role_id" TO "role";
    `);
  }
}
