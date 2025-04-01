// src/insurance-quote/services/insurance-quote.service.ts
import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { InsuranceQuote } from '../entities/insurance-quote.entity'
import { CreateInsuranceQuoteDto } from '../dto/create-insurance-quote.dto'
import { UpdateInsuranceQuoteDto } from '../dto/update-insurance-quote.dto'
import { Client } from '../../clients/entities/client.entity'
import { Producer } from '../../producers/entities/producer.entity'

@Injectable()
export class InsuranceQuoteService {
  constructor(
    @InjectRepository(InsuranceQuote)
    private readonly quoteRepository: Repository<InsuranceQuote>,

    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,

    @InjectRepository(Producer)
    private readonly producerRepository: Repository<Producer>,
  ) {}

  async create(dto: CreateInsuranceQuoteDto): Promise<InsuranceQuote> {
    const client = await this.clientRepository.findOneBy({ id: dto.clientId })
    if (!client) {
      throw new NotFoundException(`Cliente com ID ${dto.clientId} não encontrado.`)
    }

    const producer = await this.producerRepository.findOneBy({ id: dto.producerId })
    if (!producer) {
      throw new NotFoundException(`Produtor com ID ${dto.producerId} não encontrado.`)
    }

    const quote = this.quoteRepository.create({
      ...dto,
      client,
      producer,
    })

    return this.quoteRepository.save(quote)
  }

  async findAll(): Promise<InsuranceQuote[]> {
    return this.quoteRepository.find({
      relations: ['client', 'producer', 'proposals'],
      order: { createdAt: 'DESC' },
    })
  }

  async findOne(id: string): Promise<InsuranceQuote> {
    const quote = await this.quoteRepository.findOne({
      where: { id },
      relations: ['client', 'producer', 'proposals'],
    })

    if (!quote) {
      throw new NotFoundException(`Cotação com ID ${id} não encontrada.`)
    }

    return quote
  }

  async update(id: string, dto: UpdateInsuranceQuoteDto): Promise<InsuranceQuote> {
    const quote = await this.findOne(id)
    Object.assign(quote, dto)
    return this.quoteRepository.save(quote)
  }

  async remove(id: string): Promise<{ deleted: boolean }> {
    const result = await this.quoteRepository.delete(id)

    if (result.affected === 0) {
      throw new NotFoundException(`Cotação com ID ${id} não encontrada para exclusão.`)
    }

    return { deleted: true }
  }
}
