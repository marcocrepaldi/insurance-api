import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateMigrationProposalLog1744402982132 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "proposal_logs"
      ALTER COLUMN "createdById" DROP NOT NULL;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "proposal_logs"
      ALTER COLUMN "createdById" SET NOT NULL;
    `);
  }
}
