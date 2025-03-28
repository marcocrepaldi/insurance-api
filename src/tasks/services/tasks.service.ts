import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task, TaskStatus } from '../entities/task.entity';
import { TaskHistory } from '../entities/task-history.entity';
import { TaskComment } from '../entities/task-comment.entity'; // 👈 novo import
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { CreateTaskCommentDto } from '../dto/create-task-comment.dto'; // 👈 novo import
import { User } from '../../users/entities/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepo: Repository<Task>,

    @InjectRepository(TaskHistory)
    private historyRepo: Repository<TaskHistory>,

    @InjectRepository(TaskComment) // 👈 novo repository
    private commentRepo: Repository<TaskComment>,

    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async create(dto: CreateTaskDto, user: User): Promise<Task> {
    const task = this.taskRepo.create({
      title: dto.title,
      description: dto.description,
      createdBy: { id: user.id },
      assignedTo: { id: dto.assignedTo },
    });

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
    return this.updateStatus(id, TaskStatus.APPROVED, user);
  }

  async reject(id: string, user: User): Promise<Task> {
    return this.updateStatus(id, TaskStatus.REJECTED, user);
  }

  async updateStatus(id: string, status: TaskStatus, user: User): Promise<Task> {
    const task = await this.findOne(id, user);

    const previousStatus = task.status;
    task.status = status;

    await this.taskRepo.save(task);

    await this.historyRepo.save({
      action: 'STATUS_CHANGED',
      from: previousStatus,
      to: status,
      task: { id: task.id },
      changedBy: { id: user.id },
    });

    return this.taskRepo.findOne({
      where: { id },
      relations: ['createdBy', 'assignedTo'],
    });
  }

  async getTaskHistory(taskId: string): Promise<TaskHistory[]> {
    return this.historyRepo.find({
      where: { task: { id: taskId } },
      relations: ['changedBy'],
      order: { changedAt: 'DESC' },
    });
  }

  // ✅ NOVO: Criar comentário manual
  async addComment(taskId: string, dto: CreateTaskCommentDto): Promise<TaskComment> {
    const task = await this.taskRepo.findOneByOrFail({ id: taskId });
    const user = await this.userRepo.findOneByOrFail({ id: dto.userId });

    const comment = this.commentRepo.create({
      comment: dto.comment,
      task,
      user,
    });

    return this.commentRepo.save(comment);
  }

  // ✅ NOVO: Listar comentários da tarefa
  async getComments(taskId: string): Promise<TaskComment[]> {
    return this.commentRepo.find({
      where: { task: { id: taskId } },
      relations: ['user'],
      order: { createdAt: 'ASC' },
    });
  }
}
