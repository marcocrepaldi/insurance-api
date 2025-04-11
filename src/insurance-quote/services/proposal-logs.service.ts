import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ProposalLog } from '../entities/proposal-log.entity'
import { CreateProposalLogDto } from '../dto/create-proposal-log.dto'
import { UpdateProposalLogDto } from '../dto/update-proposal-log.dto'

@Injectable()
export class ProposalLogsService {
  constructor(
    @InjectRepository(ProposalLog)
    private readonly proposalLogRepository: Repository<ProposalLog>,
  ) {}

  async create(dto: CreateProposalLogDto, userId: string) {
    const log = this.proposalLogRepository.create({
      ...dto,
      createdBy: { id: userId },
    })
    return this.proposalLogRepository.save(log)
  }

  async findAllByProposal(proposalId: string) {
    return this.proposalLogRepository.find({
      where: { proposalId },
      order: { createdAt: 'DESC' },
    })
  }

  async update(id: string, dto: UpdateProposalLogDto) {
    const log = await this.proposalLogRepository.findOne({ where: { id } })
    if (!log) throw new NotFoundException('Log não encontrado')
    Object.assign(log, dto)
    return this.proposalLogRepository.save(log)
  }

  async remove(id: string) {
    const result = await this.proposalLogRepository.delete(id)
    if (result.affected === 0) throw new NotFoundException('Log não encontrado')
  }
}
