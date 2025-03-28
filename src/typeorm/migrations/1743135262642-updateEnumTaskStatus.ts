import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateEnumTaskStatus1743135262642 implements MigrationInterface {
  name = 'UpdateEnumTaskStatus1743135262642'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "tasks" 
      ALTER COLUMN "status" SET DEFAULT 'WAITING_APPROVAL'
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "tasks" 
      ALTER COLUMN "status" SET DEFAULT 'PENDING'
    `);
  }
}
