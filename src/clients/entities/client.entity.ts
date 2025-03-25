import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToMany,
    JoinColumn,
  } from 'typeorm';
  
  @Entity('clients')
  export class Client {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    // Informações pessoais
    @Column({ length: 150, nullable: false })
    name: string;
  
    @Column({ length: 20, unique: true, nullable: false })
    document: string; // CPF ou CNPJ
  
    @Column({ type: 'date', nullable: true })
    birthDate: Date;
  
    @Column({ length: 20, nullable: true })
    phone: string;
  
    @Column({ length: 150, nullable: true })
    email: string;
  
    // Endereço completo
    @Column({ length: 150, nullable: true })
    street: string; // logradouro
  
    @Column({ length: 10, nullable: true })
    number: string;
  
    @Column({ length: 100, nullable: true })
    complement: string;
  
    @Column({ length: 100, nullable: true })
    neighborhood: string;
  
    @Column({ length: 100, nullable: true })
    city: string;
  
    @Column({ length: 2, nullable: true })
    state: string;
  
    @Column({ length: 10, nullable: true })
    zipCode: string;
  
    // Caminho para armazenamento de documentos (arquivos: PDF, JPEG, PNG)
    @Column({ type: 'text', array: true, default: [] })
    documents: string[]; 
  
    // Auto-relacionamento (Indicação)
    @Column({ name: 'indicated_by', type: 'uuid', nullable: true })
    indicatedById: string | null;
  
    @ManyToOne(() => Client, (client) => client.indications, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'indicated_by' })
    indicatedBy: Client | null;
  
    @OneToMany(() => Client, (client) => client.indicatedBy)
    indications: Client[];
  
    // Status ativo/inativo
    @Column({ type: 'boolean', default: true })
    isActive: boolean;
  
    // Datas de auditoria
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
  
    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
  }
  