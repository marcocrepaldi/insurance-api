import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class AddTaskHistory1743126125806 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'task_history',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid', default: 'uuid_generate_v4()' },
          { name: 'action', type: 'varchar' },
          { name: 'from', type: 'varchar', isNullable: true },
          { name: 'to', type: 'varchar', isNullable: true },
          { name: 'task_id', type: 'uuid' },
          { name: 'changed_by', type: 'uuid' },
          { name: 'changed_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKeys('task_history', [
      new TableForeignKey({
        columnNames: ['task_id'],
        referencedTableName: 'tasks',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
      new TableForeignKey({
        columnNames: ['changed_by'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('task_history');
    const foreignKeys = table.foreignKeys.filter(
      fk => fk.columnNames.indexOf('task_id') !== -1 || fk.columnNames.indexOf('changed_by') !== -1,
    );
    await queryRunner.dropForeignKeys('task_history', foreignKeys);
    await queryRunner.dropTable('task_history');
  }
}
