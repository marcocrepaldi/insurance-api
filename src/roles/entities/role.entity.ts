import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    OneToMany, 
    CreateDateColumn, 
    UpdateDateColumn 
  } from "typeorm";
  import { User } from "../../users/entities/user.entity";
  import { MaxLength } from "class-validator";
  
  @Entity("roles")
  export class Role {
    @PrimaryGeneratedColumn("uuid")
    id: string;
  
    @Column({ unique: true })
    @MaxLength(50, { message: "O nome da role não pode ter mais de 50 caracteres." })
    name: string;
  
    @OneToMany(() => User, (user) => user.role, { cascade: ["update"] })
    users: User[];
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  }
  