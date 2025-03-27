import { Injectable, NotFoundException } from '@nestjs/common';
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
      createdBy: { id: user.id },
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
      where: {
        id,
        // Apenas criador ou responsável
        assignedTo: { id: user.id },
      },
      relations: ['assignedTo', 'createdBy'],
    });

    if (!task) throw new NotFoundException('Tarefa não encontrada');
    return task;
  }

  async update(id: string, dto: UpdateTaskDto): Promise<Task> {
    await this.taskRepo.update(id, dto);
    return this.taskRepo.findOne({ where: { id } });
  }

  async remove(id: string): Promise<void> {
    await this.taskRepo.delete(id);
  }
}
