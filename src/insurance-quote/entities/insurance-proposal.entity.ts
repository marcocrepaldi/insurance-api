import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm'
import { InsuranceQuote } from './insurance-quote.entity'
import { ProposalLog } from './proposal-log.entity'

type Coverage = {
  name: string
  value: number
  deductible?: string
}

@Entity('insurance_proposals')
export class InsuranceProposal {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(() => InsuranceQuote, (quote) => quote.proposals, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'quote_id' })
  quote: InsuranceQuote

  @Column()
  insurerName: string

  @Column({ type: 'float' })
  totalPremium: number

  @Column({ type: 'float' })
  insuredAmount: number

  @Column({ type: 'text', nullable: true })
  observations: string

  @Column({ type: 'text', nullable: true })
  pdfPath: string

  @Column({ type: 'jsonb', nullable: true })
  coverages: Coverage[]

  @OneToMany(() => ProposalLog, (log) => log.proposal, { cascade: true })
  logs: ProposalLog[]

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
