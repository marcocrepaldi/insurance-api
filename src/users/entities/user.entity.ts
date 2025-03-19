import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  BeforeInsert,
  BeforeUpdate,
} from "typeorm";
import { Role } from "../../roles/entities/role.entity";
import * as bcrypt from "bcrypt";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string; // UUID para identificação única

  @Column({ length: 100, nullable: false })
  name: string;

  @Column({ unique: true, length: 150, nullable: false })
  email: string;

  @Column({ select: false, nullable: false }) // Senha nunca é retornada nas queries
  password: string;

  @ManyToOne(() => Role, (role) => role.users, { onDelete: "SET NULL" })
  role: Role;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  async hashPasswordBeforeInsert() {
    await this.hashPassword();
  }

  @BeforeUpdate()
  async hashPasswordBeforeUpdate() {
    if (this.password) {
      const isHashed = this.password.startsWith("$2b$"); // Verifica se a senha já está hasheada
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
