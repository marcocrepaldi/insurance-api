import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateEntityQuotes1744300405860 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE "insurance_quotes_service_type_enum" AS ENUM (
        'SEGURO_CARRO',
        'SEGURO_MOTO',
        'SEGURO_CAMINHAO',
        'SEGURO_FROTAS',
        'AUTO_POR_ASSINATURA',
        'AUTO_POPULAR',
        'ASSISTENCIA_24H',
        'SEGURO_RESIDENCIAL',
        'SEGURO_CONDOMINIO',
        'SEGURO_EMPRESARIAL',
        'SEGURO_PATRIMONIAL',
        'SEGURO_EQUIPAMENTOS',
        'SEGURO_AGRICOLA',
        'VIDA_INDIVIDUAL',
        'VIDA_EM_GRUPO',
        'ACIDENTES_PESSOAIS',
        'SEGURO_FUNERAL',
        'DOENCAS_GRAVES',
        'SEGURO_PRESTAMISTA',
        'VIAGEM_NACIONAL_INTERNACIONAL',
        'VIAGEM_INTERCAMBIO',
        'VIAGEM_BAGAGEM',
        'VIAGEM_COBERTURA_MEDICA',
        'RC_PROFISSIONAL',
        'D_O',
        'E_O',
        'GARANTIA',
        'CYBER',
        'FIANCAS',
        'CREDITO',
        'RC_LIBERAIS',
        'EQUIPAMENTOS_TRABALHO',
        'VIDA_MEI',
        'CONSORCIO',
        'PREVIDENCIA_PRIVADA',
        'CAPITALIZACAO',
        'ASSISTENCIAS_AVULSAS',
        'SAUDE_ODONTO',
        'OUTROS'
      );
    `)

    await queryRunner.query(`
      ALTER TABLE "insurance_quotes"
      ADD "serviceType" "insurance_quotes_service_type_enum" NOT NULL DEFAULT 'OUTROS';
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "insurance_quotes"
      DROP COLUMN "serviceType";
    `)

    await queryRunner.query(`
      DROP TYPE "insurance_quotes_service_type_enum";
    `)
  }
}
