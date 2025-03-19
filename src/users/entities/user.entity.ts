import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  BeforeInsert,
  BeforeUpdate,
  JoinColumn,
} from 'typeorm';
import { Role } from '../../roles/entities/role.entity';
import * as bcrypt from 'bcrypt';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100, nullable: false })
  name: string;

  @Column({ unique: true, length: 150, nullable: false })
  email: string;

  @Column({ select: false, nullable: false })
  password: string;

  @ManyToOne(() => Role, (role) => role.users, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'role' }) // Define explicitamente o nome da coluna no banco
  role: Role;

  @CreateDateColumn({ name: 'created_at' }) // Garantir que usa snake_case
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' }) // Garantir que usa snake_case
  updatedAt: Date;

  @BeforeInsert()
  async hashPasswordBeforeInsert() {
    await this.hashPassword();
  }

  @BeforeUpdate()
  async hashPasswordBeforeUpdate() {
    if (this.password) {
      const isHashed = this.password.startsWith('$2b$');
      if (!isHashed) {
        await this.hashPassword();
      }
    }
  }

  private async hashPassword() {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
}
