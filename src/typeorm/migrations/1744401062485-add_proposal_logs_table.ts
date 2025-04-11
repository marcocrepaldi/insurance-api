import { MigrationInterface, QueryRunner } from "typeorm";

export class AddProposalLogsTable1744401062485 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "proposal_logs" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "proposalId" uuid NOT NULL,
        "content" text NOT NULL,
        "type" VARCHAR NOT NULL DEFAULT 'NOTA',
        "followUpAt" TIMESTAMP,
        "isFollowUpDone" BOOLEAN NOT NULL DEFAULT false,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "createdById" uuid,
        CONSTRAINT "PK_proposal_logs_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_proposal" FOREIGN KEY ("proposalId") REFERENCES "insurance_proposals"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_created_by" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE SET NULL
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "proposal_logs";`);
  }
}
