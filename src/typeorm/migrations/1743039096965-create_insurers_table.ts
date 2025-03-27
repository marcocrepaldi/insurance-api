import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateInsurersTable1743039096965 implements MigrationInterface {
  name = 'CreateInsurersTable1743039096965';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "insurers" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "nomeFantasia" character varying(150) NOT NULL,
        "razaoSocial" character varying(150) NOT NULL,
        "cnpj" character varying(18) NOT NULL,
        "inscricaoEstadual" character varying(20),
        "registroSusep" character varying(20),
        "endereco" text,
        "contato" text,
        "produtosOferecidos" text,
        "comissoes" jsonb,
        "logoPath" text,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_insurers_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_insurers_cnpj" UNIQUE ("cnpj")
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE "insurers";
    `);
  }
}
