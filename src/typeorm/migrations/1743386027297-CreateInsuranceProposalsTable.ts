import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateInsuranceProposalsTable1743386027297 implements MigrationInterface {
  name = 'CreateInsuranceProposalsTable1743386027297';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "insurance_proposals" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "insurerName" character varying NOT NULL,
        "totalPremium" double precision NOT NULL,
        "insuredAmount" double precision NOT NULL,
        "observations" text,
        "pdfPath" text,
        "coverages" jsonb,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "quote_id" uuid,
        CONSTRAINT "PK_insurance_proposals_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_insurance_proposals_quote" FOREIGN KEY ("quote_id") REFERENCES "insurance_quotes"("id") ON DELETE CASCADE ON UPDATE NO ACTION
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "insurance_proposals"`);
  }
}
