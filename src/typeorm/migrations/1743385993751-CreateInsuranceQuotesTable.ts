import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateInsuranceQuotesTable1743385993751 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: 'insurance_quotes',
      columns: [
        {
          name: 'id',
          type: 'uuid',
          isPrimary: true,
          generationStrategy: 'uuid',
          default: 'uuid_generate_v4()',
        },
        {
          name: 'title',
          type: 'varchar',
        },
        {
          name: 'description',
          type: 'text',
          isNullable: true,
        },
        {
          name: 'stage',
          type: 'varchar',
          default: `'ABERTURA'`,
        },
        {
          name: 'proposalSentAt',
          type: 'timestamp',
          isNullable: true,
        },
        {
          name: 'expectedDecisionDate',
          type: 'timestamp',
          isNullable: true,
        },
        {
          name: 'expectedPremium',
          type: 'float',
          isNullable: true,
        },
        {
          name: 'suggestedProducts',
          type: 'jsonb',
          isNullable: true,
        },
        {
          name: 'client_id',
          type: 'uuid',
        },
        {
          name: 'producer_id',
          type: 'uuid',
        },
        {
          name: 'createdBy',
          type: 'uuid',
          isNullable: true,
        },
        {
          name: 'created_at',
          type: 'timestamp',
          default: 'now()',
        },
        {
          name: 'updated_at',
          type: 'timestamp',
          default: 'now()',
        },
      ],
    }));

    await queryRunner.createForeignKey('insurance_quotes', new TableForeignKey({
      columnNames: ['client_id'],
      referencedTableName: 'clients',
      referencedColumnNames: ['id'],
      onDelete: 'CASCADE',
    }));

    await queryRunner.createForeignKey('insurance_quotes', new TableForeignKey({
      columnNames: ['producer_id'],
      referencedTableName: 'producers',
      referencedColumnNames: ['id'],
      onDelete: 'CASCADE',
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('insurance_quotes');
  }
}
