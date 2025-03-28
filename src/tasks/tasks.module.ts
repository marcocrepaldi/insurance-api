// tasks.module.ts (exemplo claro)
import { Module } from '@nestjs/common';
import { TasksService } from './services/tasks.service';
import { TasksController } from './controllers/tasks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { TaskHistory } from './entities/task-history.entity'; // 👈 Novo import

@Module({
  imports: [
    TypeOrmModule.forFeature([Task, TaskHistory]), // 👈 Novo registro
  ],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
