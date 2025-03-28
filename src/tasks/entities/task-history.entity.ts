import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    JoinColumn,
  } from 'typeorm'
  import { Task } from './task.entity'
  import { User } from '../../users/entities/user.entity'
  
  @Entity('task_history')
  export class TaskHistory {
    @PrimaryGeneratedColumn('uuid')
    id: string
  
    @Column()
    action: string
  
    @Column({ nullable: true })
    from: string
  
    @Column({ nullable: true })
    to: string
  
    @ManyToOne(() => Task, task => task.history, {
      onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'task_id' })
    task: Task
  
    @ManyToOne(() => User)
    @JoinColumn({ name: 'changed_by' })
    changedBy: User
  
    @CreateDateColumn({ name: 'changed_at' })
    changedAt: Date
  }
  