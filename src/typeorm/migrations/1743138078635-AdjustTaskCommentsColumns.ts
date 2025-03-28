import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AdjustTaskCommentsColumns1743138078635 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Renomeando as colunas para o padrão snake_case
    await queryRunner.renameColumn('task_comments', 'taskId', 'task_id');
    await queryRunner.renameColumn('task_comments', 'userId', 'user_id');
    
    // Verificando se a coluna 'created_at' já existe, se não, a criamos
    const table = await queryRunner.getTable('task_comments');
    if (!table?.columns.find(col => col.name === 'created_at')) {
      await queryRunner.addColumn('task_comments', new TableColumn({
        name: 'created_at',
        type: 'timestamp',
        isNullable: false, // Definido como não nulo
        default: 'CURRENT_TIMESTAMP',
      }));
    }
    
    // Renomeando a coluna 'createdAt' para 'created_at' se existir
    const createdAtColumn = table?.columns.find(col => col.name === 'createdAt');
    if (createdAtColumn) {
      await queryRunner.renameColumn('task_comments', 'createdAt', 'created_at');
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revertendo as mudanças
    await queryRunner.renameColumn('task_comments', 'task_id', 'taskId');
    await queryRunner.renameColumn('task_comments', 'user_id', 'userId');
    await queryRunner.renameColumn('task_comments', 'created_at', 'createdAt');
  }
}
