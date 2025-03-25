import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateClientsWithSelfReference1742923950564 implements MigrationInterface {
  name = 'CreateClientsWithSelfReference1742923950564';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "clients" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying(150) NOT NULL,
        "document" character varying(20) NOT NULL,
        "birthDate" date,
        "phone" character varying(20),
        "email" character varying(150),
        "street" character varying(150),
        "number" character varying(10),
        "complement" character varying(100),
        "neighborhood" character varying(100),
        "city" character varying(100),
        "state" character varying(2),
        "zipCode" character varying(10),
        "documents" text array NOT NULL DEFAULT '{}',
        "indicated_by" uuid,
        "isActive" boolean NOT NULL DEFAULT true,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_clients_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_clients_document" UNIQUE ("document"),
        CONSTRAINT "FK_clients_indicated_by" FOREIGN KEY ("indicated_by") REFERENCES "clients"("id") ON DELETE SET NULL
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "clients"`);
  }
}
