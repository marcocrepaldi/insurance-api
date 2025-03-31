// src/insurance-quote/services/insurance-proposal.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InsuranceProposal } from '../entities/insurance-proposal.entity';
import { Repository } from 'typeorm';
import { CreateInsuranceProposalDto } from '../dto/create-insurance-proposal.dto'; // ✅ Correção aqui!
import { InsuranceQuote } from '../entities/insurance-quote.entity';

@Injectable()
export class InsuranceProposalService {
  constructor(
    @InjectRepository(InsuranceProposal)
    private proposalRepo: Repository<InsuranceProposal>,
    @InjectRepository(InsuranceQuote)
    private quoteRepo: Repository<InsuranceQuote>,
  ) {}

  async create(dto: CreateInsuranceProposalDto): Promise<InsuranceProposal> {
    const quote = await this.quoteRepo.findOneByOrFail({ id: dto.quoteId });

    const proposal = this.proposalRepo.create({
      ...dto,
      quote,
    });

    return this.proposalRepo.save(proposal);
  }

  async findAllByQuote(quoteId: string): Promise<InsuranceProposal[]> {
    return this.proposalRepo.find({
      where: { quote: { id: quoteId } },
    });
  }
}
