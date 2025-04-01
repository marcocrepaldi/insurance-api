import { MigrationInterface, QueryRunner } from 'typeorm'

export class InsuranceQuotes1743530498093 implements MigrationInterface {
  name = 'InsuranceQuotes1743530498093'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE "quote_stage_enum" AS ENUM (
        'ABERTURA',
        'EM_ABORDAGEM',
        'PROPOSTA_ENVIADA',
        'EM_NEGOCIACAO',
        'APROVADA',
        'PERDIDA',
        'CANCELADA'
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "insurance_quotes" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "title" character varying NOT NULL,
        "description" text,
        "stage" "quote_stage_enum" NOT NULL DEFAULT 'ABERTURA',
        "proposalSentAt" TIMESTAMP,
        "expectedDecisionDate" TIMESTAMP,
        "expectedPremium" double precision,
        "suggestedProducts" jsonb,
        "createdBy" uuid,
        "client_id" uuid NOT NULL,
        "producer_id" uuid NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_insurance_quotes_id" PRIMARY KEY ("id")
      )
    `);

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
        CONSTRAINT "PK_insurance_proposals_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      ALTER TABLE "insurance_quotes"
      ADD CONSTRAINT "FK_insurance_quotes_client"
      FOREIGN KEY ("client_id") REFERENCES "clients"("id")
      ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "insurance_quotes"
      ADD CONSTRAINT "FK_insurance_quotes_producer"
      FOREIGN KEY ("producer_id") REFERENCES "producers"("id")
      ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "insurance_proposals"
      ADD CONSTRAINT "FK_proposals_quote"
      FOREIGN KEY ("quote_id") REFERENCES "insurance_quotes"("id")
      ON DELETE CASCADE ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "insurance_proposals" DROP CONSTRAINT "FK_proposals_quote"
    `);

    await queryRunner.query(`
      ALTER TABLE "insurance_quotes" DROP CONSTRAINT "FK_insurance_quotes_producer"
    `);

    await queryRunner.query(`
      ALTER TABLE "insurance_quotes" DROP CONSTRAINT "FK_insurance_quotes_client"
    `);

    await queryRunner.query(`
      DROP TABLE "insurance_proposals"
    `);

    await queryRunner.query(`
      DROP TABLE "insurance_quotes"
    `);

    await queryRunner.query(`
      DROP TYPE "quote_stage_enum"
    `);
  }
}
