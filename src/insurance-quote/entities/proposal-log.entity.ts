import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
  } from 'typeorm'
  import { User } from '../../users/entities/user.entity'
  import { InsuranceProposal } from './insurance-proposal.entity'
  
  export enum ProposalLogType {
    NOTA = 'NOTA',
    LIGACAO = 'LIGACAO',
    VISITA = 'VISITA',
    EMAIL = 'EMAIL',
    OUTRO = 'OUTRO',
  }
  
  @Entity('proposal_logs')
  export class ProposalLog {
    @PrimaryGeneratedColumn('uuid')
    id: string
  
    @Column()
    proposalId: string
  
    @ManyToOne(() => InsuranceProposal, (proposal) => proposal.logs, {
      onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'proposalId' })
    proposal: InsuranceProposal
  
    @Column({ type: 'text' })
    content: string
  
    @Column({ type: 'enum', enum: ProposalLogType, default: ProposalLogType.NOTA })
    type: ProposalLogType
  
    @Column({ type: 'timestamp', nullable: true })
    followUpAt: Date | null
  
    @Column({ default: false })
    isFollowUpDone: boolean
  
    @CreateDateColumn()
    createdAt: Date
  
    @ManyToOne(() => User, { eager: true, nullable: true })
    @JoinColumn({ name: 'createdBy' })
    createdBy: User
    
  }
  