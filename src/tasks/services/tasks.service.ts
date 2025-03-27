import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
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
  
    console.log('💡 Task antes do save:', task); // <-- AQUI!
  
    const saved = await this.taskRepo.save(task);
  
    return this.taskRepo.findOne({
      where: { id: saved.id },
      relations: ['createdBy', 'assignedTo'],
    });
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
    const task = await this.findOne(id, user);
    Object.assign(task, dto);
    await this.taskRepo.save(task);

    return this.taskRepo.findOne({
      where: { id },
      relations: ['createdBy', 'assignedTo'],
    });
  }

  async remove(id: string): Promise<void> {
    const task = await this.taskRepo.findOne({ where: { id } });
    if (!task) throw new NotFoundException('Tarefa não encontrada');
    await this.taskRepo.delete(id);
  }

  async approve(id: string, user: User): Promise<Task> {
    const task = await this.findOne(id, user);
  
    if (task.status === TaskStatus.APPROVED) {
      throw new Error('Tarefa já aprovada.');
    }
  
    task.status = TaskStatus.APPROVED;
    await this.taskRepo.save(task);
  
    return this.taskRepo.findOne({
      where: { id: task.id },
      relations: ['createdBy', 'assignedTo'],
    });
  }
  
  async reject(id: string, user: User): Promise<Task> {
    const task = await this.findOne(id, user);
  
    if (task.status === TaskStatus.REJECTED) {
      throw new Error('Tarefa já rejeitada.');
    }
  
    task.status = TaskStatus.REJECTED;
    await this.taskRepo.save(task);
  
    return this.taskRepo.findOne({
      where: { id: task.id },
      relations: ['createdBy', 'assignedTo'],
    });
  }

  async updateStatus(id: string, status: TaskStatus, user: User): Promise<Task> {
    const task = await this.findOne(id, user);
  
    if (!task) {
      throw new NotFoundException('Tarefa não encontrada');
    }
  
    task.status = status as TaskStatus;
  
    await this.taskRepo.save(task);
  
    return this.taskRepo.findOne({
      where: { id },
      relations: ['createdBy', 'assignedTo'],
    });
  }
}  
