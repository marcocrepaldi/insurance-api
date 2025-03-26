import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
  } from 'typeorm';
  
  export enum ProducerType {
    INTERNAL = 'INTERNAL',
    EXTERNAL = 'EXTERNAL',
  }
  
  @Entity('producers')
  export class Producer {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column()
    name: string;
  
    @Column({ unique: true })
    cpfCnpj: string;
  
    @Column()
    phone: string;
  
    @Column()
    email: string;
  
    @Column({
      type: 'enum',
      enum: ProducerType,
    })
    type: ProducerType;
  
    @Column({ type: 'jsonb', nullable: true })
    address: {
      street: string;
      number: string;
      complement?: string;
      neighborhood: string;
      city: string;
      state: string;
      zipCode: string;
    };
  
    @Column({ nullable: true })
    pixKey: string;
  
    @Column({ type: 'jsonb', nullable: true })
    documents?: {
      idDocument?: string;
      taxDocument?: string;
      proofOfAddress?: string;
      others?: string[];
    };
  
    @Column({ default: true })
    isActive: boolean;
  
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
  
    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
  }
  