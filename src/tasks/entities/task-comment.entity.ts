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
  
    @Column()
    comment: string;
  
    @ManyToOne(() => Task, (task) => task.comments)
    @JoinColumn({ name: 'taskId' }) // <- igual ao nome no banco
    task: Task;
  
    @ManyToOne(() => User)
    @JoinColumn({ name: 'userId' }) // <- igual ao nome no banco
    user: User;
  
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
  }
  