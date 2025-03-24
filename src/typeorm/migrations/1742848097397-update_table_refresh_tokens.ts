import { MigrationInterface, QueryRunner } from "typeorm";

export class update_table_refresh_tokens1742848097397 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE refresh_tokens
      ADD COLUMN token_hash VARCHAR NOT NULL;
    `);

    await queryRunner.query(`
      ALTER TABLE refresh_tokens
      ALTER COLUMN token DROP NOT NULL;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE refresh_tokens
      ALTER COLUMN token SET NOT NULL;
    `);

    await queryRunner.query(`
      ALTER TABLE refresh_tokens
      DROP COLUMN token_hash;
    `);
  }
}
