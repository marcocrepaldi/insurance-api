import { Module } from '@nestjs/common';
import { TasksService } from './services/tasks.service';
import { TasksController } from './controllers/tasks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { TaskHistory } from './entities/task-history.entity';
import { TaskComment } from './entities/task-comment.entity'; // ✅ novo
import { User } from '../users/entities/user.entity'; // ✅ necessário para buscar o autor

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Task,
      TaskHistory,
      TaskComment, // ✅ adiciona TaskComment aqui
      User,         // ✅ e também o User
    ]),
  ],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
