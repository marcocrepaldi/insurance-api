import { MigrationInterface, QueryRunner } from "typeorm";

export class AddLabelToTask1743093124353 implements MigrationInterface {
  name = "AddLabelToTask1743093124353";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE "task_label_enum" AS ENUM (
        'BUG',
        'FEATURE',
        'URGENT',
        'IMPROVEMENT'
      )
    `);

    await queryRunner.query(`
      ALTER TABLE "tasks"
      ADD "label" "task_label_enum"
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "tasks"
      DROP COLUMN "label"
    `);

    await queryRunner.query(`
      DROP TYPE "task_label_enum"
    `);
  }
}
