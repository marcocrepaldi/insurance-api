import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { TaskHistory } from './task-history.entity';
import { TaskComment } from './task-comment.entity'; // 👈 novo import

export enum TaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  WAITING_APPROVAL = 'WAITING_APPROVAL',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export enum TaskLabel {
  BUG = 'BUG',
  FEATURE = 'FEATURE',
  URGENT = 'URGENT',
  IMPROVEMENT = 'IMPROVEMENT',
}

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.PENDING,
  })
  status: TaskStatus;

  @Column({
    type: 'enum',
    enum: TaskLabel,
    nullable: true,
  })
  label: TaskLabel;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'assigned_to' })
  assignedTo: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  createdBy: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // 👇 Histórico da tarefa
  @OneToMany(() => TaskHistory, (history) => history.task, {
    cascade: true,
  })
  history: TaskHistory[];

  // 👇 Comentários da tarefa (novo!)
  @OneToMany(() => TaskComment, (comment) => comment.task, {
    cascade: true,
  })
  comments: TaskComment[];
}
