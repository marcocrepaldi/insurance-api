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
import { Client } from '../../clients/entities/client.entity'
import { Producer } from '../../producers/entities/producer.entity'
import { InsuranceProposal } from './insurance-proposal.entity'
import { User } from '../../users/entities/user.entity'

export enum QuoteStage {
  ABERTURA = 'ABERTURA',
  EM_ABORDAGEM = 'EM_ABORDAGEM',
  PROPOSTA_ENVIADA = 'PROPOSTA_ENVIADA',
  EM_NEGOCIACAO = 'EM_NEGOCIACAO',
  APROVADA = 'APROVADA',
  PERDIDA = 'PERDIDA',
  CANCELADA = 'CANCELADA',
}

export enum QuoteServiceType {
  // Automóveis
  SEGURO_CARRO = 'SEGURO_CARRO',
  SEGURO_MOTO = 'SEGURO_MOTO',
  SEGURO_CAMINHAO = 'SEGURO_CAMINHAO',
  SEGURO_FROTAS = 'SEGURO_FROTAS',
  AUTO_POR_ASSINATURA = 'AUTO_POR_ASSINATURA',
  AUTO_POPULAR = 'AUTO_POPULAR',
  ASSISTENCIA_24H = 'ASSISTENCIA_24H',

  // Residenciais e Patrimoniais
  SEGURO_RESIDENCIAL = 'SEGURO_RESIDENCIAL',
  SEGURO_CONDOMINIO = 'SEGURO_CONDOMINIO',
  SEGURO_EMPRESARIAL = 'SEGURO_EMPRESARIAL',
  SEGURO_PATRIMONIAL = 'SEGURO_PATRIMONIAL',
  SEGURO_EQUIPAMENTOS = 'SEGURO_EQUIPAMENTOS',
  SEGURO_AGRICOLA = 'SEGURO_AGRICOLA',

  // Pessoais
  VIDA_INDIVIDUAL = 'VIDA_INDIVIDUAL',
  VIDA_EM_GRUPO = 'VIDA_EM_GRUPO',
  ACIDENTES_PESSOAIS = 'ACIDENTES_PESSOAIS',
  SEGURO_FUNERAL = 'SEGURO_FUNERAL',
  DOENCAS_GRAVES = 'DOENCAS_GRAVES',
  SEGURO_PRESTAMISTA = 'SEGURO_PRESTAMISTA',

  // Viagem
  VIAGEM_NACIONAL_INTERNACIONAL = 'VIAGEM_NACIONAL_INTERNACIONAL',
  VIAGEM_INTERCAMBIO = 'VIAGEM_INTERCAMBIO',
  VIAGEM_BAGAGEM = 'VIAGEM_BAGAGEM',
  VIAGEM_COBERTURA_MEDICA = 'VIAGEM_COBERTURA_MEDICA',

  // Corporativos
  RC_PROFISSIONAL = 'RC_PROFISSIONAL',
  D_O = 'D_O',
  E_O = 'E_O',
  GARANTIA = 'GARANTIA',
  CYBER = 'CYBER',
  FIANCAS = 'FIANCAS',
  CREDITO = 'CREDITO',

  // Profissionais / MEI
  RC_LIBERAIS = 'RC_LIBERAIS',
  EQUIPAMENTOS_TRABALHO = 'EQUIPAMENTOS_TRABALHO',
  VIDA_MEI = 'VIDA_MEI',

  // Outros Serviços e Produtos
  CONSORCIO = 'CONSORCIO',
  PREVIDENCIA_PRIVADA = 'PREVIDENCIA_PRIVADA',
  CAPITALIZACAO = 'CAPITALIZACAO',
  ASSISTENCIAS_AVULSAS = 'ASSISTENCIAS_AVULSAS',
  SAUDE_ODONTO = 'SAUDE_ODONTO',
}

@Entity('insurance_quotes')
export class InsuranceQuote {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  title: string

  @Column({ type: 'text', nullable: true })
  description: string

  @Column({
    type: 'enum',
    enum: QuoteStage,
    default: QuoteStage.ABERTURA,
  })
  stage: QuoteStage

  @Column({
    type: 'enum',
    enum: QuoteServiceType,
  })
  serviceType: QuoteServiceType

  @Column({ type: 'timestamp', nullable: true })
  proposalSentAt: Date

  @Column({ type: 'timestamp', nullable: true })
  expectedDecisionDate: Date

  @Column({ type: 'float', nullable: true })
  expectedPremium: number

  @Column({ type: 'jsonb', nullable: true })
  suggestedProducts: string[]

  // 👇 NOVO CAMPO para armazenar os dados específicos do tipo de produto
  @Column({ type: 'jsonb', nullable: true })
  serviceDetails: Record<string, any>

  @ManyToOne(() => Client, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'client_id' })
  client: Client

  @ManyToOne(() => Producer, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'producer_id' })
  producer: Producer

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'created_by' })
  createdBy: User

  @OneToMany(() => InsuranceProposal, (proposal) => proposal.quote, {
    cascade: true,
  })
  proposals: InsuranceProposal[]

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
