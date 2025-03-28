import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  ParseUUIDPipe,
} from '@nestjs/common';
import { TasksService } from '../services/tasks.service';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { UpdateTaskStatusDto } from '../dto/update-task-status.dto';
import { CreateTaskCommentDto } from '../dto/create-task-comment.dto';
import { AssignUserDto } from '../dto/assign-user.dto'; // ✅ Novo DTO para transferência
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { User } from '../../users/entities/user.entity';
import { TaskStatus } from '../entities/task.entity';

@Controller('tasks')
@UseGuards(AuthGuard('jwt'))
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  async create(@Body() dto: CreateTaskDto, @Req() req: Request) {
    const user = req.user as User;
    return this.tasksService.create(dto, user);
  }

  @Get()
  async findAll(@Req() req: Request) {
    const user = req.user as User;
    return this.tasksService.findAll(user);
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string, @Req() req: Request) {
    const user = req.user as User;
    return this.tasksService.findOne(id, user);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTaskDto,
    @Req() req: Request,
  ) {
    const user = req.user as User;
    return this.tasksService.update(id, dto, user);
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.tasksService.remove(id);
  }

  @Patch(':id/approve')
  async approve(@Param('id', ParseUUIDPipe) id: string, @Req() req: Request) {
    const user = req.user as User;
    return this.tasksService.approve(id, user);
  }

  @Patch(':id/reject')
  async reject(@Param('id', ParseUUIDPipe) id: string, @Req() req: Request) {
    const user = req.user as User;
    return this.tasksService.reject(id, user);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTaskStatusDto,
    @Req() req: Request,
  ) {
    const user = req.user as User;
    return this.tasksService.updateStatus(id, dto.status as TaskStatus, user);
  }

  // ✅ Histórico de alterações
  @Get(':id/history')
  async getHistory(@Param('id', ParseUUIDPipe) id: string) {
    return this.tasksService.getTaskHistory(id);
  }

  // ✅ Criar comentário manual
  @Post(':id/comments')
  async addComment(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CreateTaskCommentDto,
  ) {
    return this.tasksService.addComment(id, dto);
  }

  // ✅ Listar comentários
  @Get(':id/comments')
  async getComments(@Param('id', ParseUUIDPipe) id: string) {
    return this.tasksService.getComments(id);
  }

  // ✅ NOVO: Transferir tarefa para outro usuário
  @Patch(':id/assign')
  async assignUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AssignUserDto,
    @Req() req: Request
  ) {
    const user = req.user as User;
    return this.tasksService.assignUser(id, dto.userId, user);
  }
}
