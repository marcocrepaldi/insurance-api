import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    JoinColumn,
  } from 'typeorm';
  import { Task } from './task.entity';
  import { User } from '../../users/entities/user.entity';
  
  @Entity('task_comments')
  export class TaskComment {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column('text')
    comment: string;
  
    @ManyToOne(() => Task, (task) => task.comments, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'task_id' })
    task: Task;
  
    @ManyToOne(() => User, { eager: true })
    @JoinColumn({ name: 'user_id' })
    user: User;
  
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
  }
  