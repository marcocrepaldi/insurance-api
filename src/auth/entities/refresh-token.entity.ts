import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('refresh_tokens')
export class RefreshToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // 🔐 Campo opcional: armazenar o token original (recomendado deixar nullable e select: false em produção)
  @Column({ nullable: true, select: false })
  token?: string;

  // ✅ Novo campo para armazenar o hash do token
  @Column({ name: 'token_hash' })
  tokenHash: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'expires_at' })
  expiresAt: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
