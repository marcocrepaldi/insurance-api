// src/insurance-quote/services/insurance-proposal.service.ts
import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { InsuranceProposal } from '../entities/insurance-proposal.entity'
import { CreateInsuranceProposalDto } from '../dto/create-insurance-proposal.dto'
import { UpdateInsuranceProposalDto } from '../dto/update-insurance-proposal.dto'
import { InsuranceQuote } from '../entities/insurance-quote.entity'

@Injectable()
export class InsuranceProposalService {
  constructor(
    @InjectRepository(InsuranceProposal)
    private readonly proposalRepository: Repository<InsuranceProposal>,

    @InjectRepository(InsuranceQuote)
    private readonly quoteRepository: Repository<InsuranceQuote>,
  ) {}

  async create(dto: CreateInsuranceProposalDto): Promise<InsuranceProposal> {
    const quote = await this.quoteRepository.findOneByOrFail({ id: dto.quoteId })

    const proposal = this.proposalRepository.create({
      ...dto,
      quote,
    })

    return this.proposalRepository.save(proposal)
  }

  async findAllByQuote(quoteId: string): Promise<InsuranceProposal[]> {
    return this.proposalRepository.find({
      where: { quote: { id: quoteId } },
      relations: ['quote'],
    })
  }

  async findOne(id: string): Promise<InsuranceProposal> {
    const proposal = await this.proposalRepository.findOne({
      where: { id },
      relations: ['quote'],
    })

    if (!proposal) {
      throw new NotFoundException(`Proposta com ID ${id} não encontrada.`)
    }

    return proposal
  }

  async update(id: string, dto: UpdateInsuranceProposalDto): Promise<InsuranceProposal> {
    const proposal = await this.findOne(id)
    Object.assign(proposal, dto)
    return this.proposalRepository.save(proposal)
  }

  async remove(id: string): Promise<{ deleted: boolean }> {
    const result = await this.proposalRepository.delete(id)

    if (result.affected === 0) {
      throw new NotFoundException(`Proposta com ID ${id} não encontrada para exclusão.`)
    }

    return { deleted: true }
  }
}
