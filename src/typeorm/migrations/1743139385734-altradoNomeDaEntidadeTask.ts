import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class RecreateTaskCommentsTable1743140585734 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Deletando a tabela se ela existir
    await queryRunner.query('DROP TABLE IF EXISTS "task_comments"');

    // Criando a tabela com as colunas corretas
    await queryRunner.createTable(
      new Table({
        name: 'task_comments',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'comment',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'task_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'user_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
        foreignKeys: [
          {
            name: 'FK_Task',
            columnNames: ['task_id'],
            referencedTableName: 'tasks',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
          {
            name: 'FK_User',
            columnNames: ['user_id'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Deletando a tabela task_comments no rollback
    await queryRunner.query('DROP TABLE IF EXISTS "task_comments"');
  }
}
