import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
  } from 'typeorm';
  
  @Entity('insurers')
  export class Insurer {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({ length: 150 })
    nomeFantasia: string;
  
    @Column({ length: 150 })
    razaoSocial: string;
  
    @Column({ unique: true, length: 18 })
    cnpj: string;
  
    @Column({ nullable: true, length: 20 })
    inscricaoEstadual: string;
  
    @Column({ nullable: true, length: 20 })
    registroSusep: string;
  
    @Column({ nullable: true })
    endereco: string;
  
    @Column({ nullable: true })
    contato: string;
  
    @Column('simple-array', { nullable: true })
    produtosOferecidos: string[]; // exemplo: ["Seguro Auto", "Seguro Vida"]
  
    @Column('jsonb', { nullable: true })
    comissoes: {
      [tipoSeguro: string]: number; // Exemplo: { "Seguro Auto": 10, "Seguro Vida": 15 }
    };
  
    @Column({ nullable: true })
    logoPath: string; // caminho da logo salva no sistema
  
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
  
    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
  }
  