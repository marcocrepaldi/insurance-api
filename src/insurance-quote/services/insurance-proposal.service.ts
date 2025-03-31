// src/insurance-quote/services/insurance-proposal.service.ts
import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { InsuranceProposal } from '../entities/insurance-proposal.entity'
import { InsuranceQuote } from '../entities/insurance-quote.entity'
import { CreateInsuranceProposalDto } from '../dto/create-insurance-proposal.dto'

@Injectable()
export class InsuranceProposalService {
  constructor(
    @InjectRepository(InsuranceProposal)
    private proposalRepo: Repository<InsuranceProposal>,
    @InjectRepository(InsuranceQuote)
    private quoteRepo: Repository<InsuranceQuote>,
  ) {}

  async create(dto: CreateInsuranceProposalDto): Promise<InsuranceProposal> {
    const quote = await this.quoteRepo.findOne({
      where: { id: dto.quoteId },
    })

    if (!quote) {
      throw new NotFoundException(`Cotação com ID ${dto.quoteId} não encontrada.`)
    }

    const proposal = this.proposalRepo.create({
      ...dto,
      quote,
    })

    return await this.proposalRepo.save(proposal)
  }

  async findAllByQuote(quoteId: string): Promise<InsuranceProposal[]> {
    return await this.proposalRepo.find({
      where: { quote: { id: quoteId } },
    })
  }
}
