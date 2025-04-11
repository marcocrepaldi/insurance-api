import { IsEnum, IsOptional, IsString, IsUUID, IsDateString } from 'class-validator'
import { ProposalLogType } from '../entities/proposal-log.entity'

export class CreateProposalLogDto {
  @IsUUID()
  proposalId: string

  @IsString()
  content: string

  @IsEnum(ProposalLogType)
  @IsOptional()
  type?: ProposalLogType

  @IsDateString()
  @IsOptional()
  followUpAt?: string
}
