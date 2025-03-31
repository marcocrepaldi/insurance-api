// src/insurance-quote/entities/insurance-quote.entity.ts
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
    OneToMany,
  } from 'typeorm';
  import { Client } from '../../clients/entities/client.entity';
  import { Producer } from '../../producers/entities/producer.entity';
  import { InsuranceProposal } from './insurance-proposal.entity';
  
  export enum QuoteStage {
    ABERTURA = 'ABERTURA',
    EM_ABORDAGEM = 'EM_ABORDAGEM',
    PROPOSTA_ENVIADA = 'PROPOSTA_ENVIADA',
    EM_NEGOCIACAO = 'EM_NEGOCIACAO',
    APROVADA = 'APROVADA',
    PERDIDA = 'PERDIDA',
    CANCELADA = 'CANCELADA',
  }
  
  @Entity('insurance_quotes')
  export class InsuranceQuote {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column()
    title: string;
  
    @Column({ type: 'text', nullable: true })
    description: string;
  
    @Column({
      type: 'enum',
      enum: QuoteStage,
      default: QuoteStage.ABERTURA,
    })
    stage: QuoteStage;
  
    @Column({ type: 'timestamp', nullable: true })
    proposalSentAt: Date;
  
    @Column({ type: 'timestamp', nullable: true })
    expectedDecisionDate: Date;
  
    @Column({ type: 'float', nullable: true })
    expectedPremium: number;
  
    @Column({ type: 'jsonb', nullable: true })
    suggestedProducts: string[];
  
    @ManyToOne(() => Client, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'client_id' })
    client: Client;
  
    @ManyToOne(() => Producer, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'producer_id' })
    producer: Producer;
  
    @Column({ nullable: true })
    createdBy: string;
  
    @OneToMany(() => InsuranceProposal, (proposal) => proposal.quote, {
      cascade: true,
    })
    proposals: InsuranceProposal[];
  
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
  
    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
  }
  