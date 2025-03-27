import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task, TaskStatus } from '../entities/task.entity';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepo: Repository<Task>,
  ) {}

  async create(dto: CreateTaskDto, user: User): Promise<Task> {
    const task = this.taskRepo.create({
      title: dto.title,
      description: dto.description,
      createdBy: { id: user.id },                // ✅ garante que seja objeto válido
      assignedTo: { id: dto.assignedTo },
    });

    return this.taskRepo.save(task);
  }

  async findAll(user: User): Promise<Task[]> {
    return this.taskRepo.find({
      where: [
        { createdBy: { id: user.id } },
        { assignedTo: { id: user.id } },
      ],
      relations: ['assignedTo', 'createdBy'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, user: User): Promise<Task> {
    const task = await this.taskRepo.findOne({
      where: { id },
      relations: ['assignedTo', 'createdBy'],
    });

    if (!task) throw new NotFoundException('Tarefa não encontrada');

    const isAuthorized =
      task.createdBy?.id === user.id || task.assignedTo?.id === user.id;

    if (!isAuthorized) {
      throw new ForbiddenException('Acesso negado a esta tarefa');
    }

    return task;
  }

  async update(id: string, dto: UpdateTaskDto, user: User): Promise<Task> {
    const task = await this.findOne(id, user); // ✅ valida antes
    Object.assign(task, dto);
    return this.taskRepo.save(task);
  }

  async remove(id: string): Promise<void> {
    await this.taskRepo.delete(id);
  }
}
