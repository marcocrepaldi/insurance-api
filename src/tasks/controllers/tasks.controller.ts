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
    create(@Body() dto: CreateTaskDto, @Req() req: Request) {
      return this.tasksService.create(dto, req.user as User);
    }
  
    @Get()
    findAll(@Req() req: Request) {
      return this.tasksService.findAll(req.user as User);
    }
  
    @Get(':id')
    findOne(
      @Param('id', new ParseUUIDPipe()) id: string,
      @Req() req: Request,
    ) {
      return this.tasksService.findOne(id, req.user as User);
    }
  
    @Patch(':id')
    update(
      @Param('id', new ParseUUIDPipe()) id: string,
      @Body() dto: UpdateTaskDto,
    ) {
      return this.tasksService.update(id, dto);
    }
  
    @Delete(':id')
    remove(@Param('id', new ParseUUIDPipe()) id: string) {
      return this.tasksService.remove(id);
    }
  }
  