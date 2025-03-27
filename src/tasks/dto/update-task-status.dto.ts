import { TaskStatus } from '../entities/task.entity'
import { IsEnum } from 'class-validator'

export class UpdateTaskStatusDto {
  @IsEnum(TaskStatus)
  status: TaskStatus
}
