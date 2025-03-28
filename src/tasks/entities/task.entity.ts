import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm'
import { User } from '../../users/entities/user.entity'
import { TaskHistory } from './task-history.entity'
import { TaskComment } from './task-comment.entity'

// 🟡 Status da tarefa com fluxo atualizado
export enum TaskStatus {
  WAITING_APPROVAL = 'WAITING_APPROVAL', // Criada, aguardando responsável aprovar
  PENDING = 'PENDING',                   // Aprovada, pendente de início
  IN_PROGRESS = 'IN_PROGRESS',          // Em andamento
  APPROVED = 'APPROVED',                // Finalizada com sucesso
  REJECTED = 'REJECTED',                // Recusada (não será executada)
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
  id: string

  @Column()
  title: string

  @Column({ nullable: true })
  description: string

  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.WAITING_APPROVAL, // ✅ novo default
  })
  status: TaskStatus

  @Column({
    type: 'enum',
    enum: TaskLabel,
    nullable: true,
  })
  label: TaskLabel

  @ManyToOne(() => User)
  @JoinColumn({ name: 'assigned_to' })
  assignedTo: User

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  createdBy: User

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  @OneToMany(() => TaskHistory, (history) => history.task, {
    cascade: true,
  })
  history: TaskHistory[]

  @OneToMany(() => TaskComment, (comment) => comment.task, {
    cascade: true,
  })
  comments: TaskComment[]
}
