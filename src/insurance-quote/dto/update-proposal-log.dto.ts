import { PartialType } from '@nestjs/mapped-types'
import { CreateProposalLogDto } from './create-proposal-log.dto'

export class UpdateProposalLogDto extends PartialType(CreateProposalLogDto) {}
