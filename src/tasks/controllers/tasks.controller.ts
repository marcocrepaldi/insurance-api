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
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { User } from '../../users/entities/user.entity';

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
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: Request,
  ) {
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

  // (Opcional) Aprovar tarefa com PATCH /tasks/:id/approve
  // @Patch(':id/approve')
  // async approve(
  //   @Param('id', ParseUUIDPipe) id: string,
  //   @Req() req: Request,
  // ) {
  //   const user = req.user as User;
  //   return this.tasksService.update(id, { status: TaskStatus.APPROVED }, user);
  // }
}
