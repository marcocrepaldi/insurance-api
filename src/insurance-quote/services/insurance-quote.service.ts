// src/insurance-quote/services/insurance-quote.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InsuranceQuote } from '../entities/insurance-quote.entity';
import { Repository } from 'typeorm';
import { CreateInsuranceQuoteDto } from '../dto/create-insurance-quote.dto';
import { UpdateInsuranceQuoteDto } from '../dto/update-insurance-quote.dto';
import { Client } from '../../clients/entities/client.entity';
import { Producer } from '../../producers/entities/producer.entity';

@Injectable()
export class InsuranceQuoteService {
  constructor(
    @InjectRepository(InsuranceQuote)
    private quoteRepo: Repository<InsuranceQuote>,
    @InjectRepository(Client)
    private clientRepo: Repository<Client>,
    @InjectRepository(Producer)
    private producerRepo: Repository<Producer>,
  ) {}

  async create(dto: CreateInsuranceQuoteDto): Promise<InsuranceQuote> {
    const client = await this.clientRepo.findOneByOrFail({ id: dto.clientId });
    const producer = await this.producerRepo.findOneByOrFail({ id: dto.producerId });

    const quote = this.quoteRepo.create({
      ...dto,
      client,
      producer,
    });

    return this.quoteRepo.save(quote);
  }

  findAll(): Promise<InsuranceQuote[]> {
    return this.quoteRepo.find({ relations: ['client', 'producer', 'proposals'] });
  }

  async findOne(id: string): Promise<InsuranceQuote> {
    const quote = await this.quoteRepo.findOne({
      where: { id },
      relations: ['client', 'producer', 'proposals'],
    });
    if (!quote) throw new NotFoundException('Quote not found');
    return quote;
  }

  async update(id: string, dto: UpdateInsuranceQuoteDto): Promise<InsuranceQuote> {
    const quote = await this.findOne(id);
    Object.assign(quote, dto);
    return this.quoteRepo.save(quote);
  }

  async remove(id: string): Promise<void> {
    await this.quoteRepo.delete(id);
  }
}
