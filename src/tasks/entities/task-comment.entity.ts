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
  @JoinColumn({ name: 'task_id' }) // CORRIGIDO
  task: Task;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' }) // CORRIGIDO
  user: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
