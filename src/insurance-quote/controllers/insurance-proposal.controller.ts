// src/insurance-quote/controllers/insurance-proposal.controller.ts
import {
  Controller,
  Get,
  Param,
  Patch,
  Body,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common'
import { InsuranceProposalService } from '../services/insurance-proposal.service'
import { UpdateInsuranceProposalDto } from '../dto/update-insurance-proposal.dto'
import { AuthGuard } from '@nestjs/passport'
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger'

@ApiTags('insurance-proposals')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('insurance-quotes/proposals')
export class InsuranceProposalController {
  constructor(private readonly proposalService: InsuranceProposalService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Buscar proposta por ID' })
  findOne(@Param('id', new ParseUUIDPipe()) id: string): Promise<any> {
    return this.proposalService.findOne(id)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar dados da proposta' })
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateInsuranceProposalDto,
  ): Promise<any> {
    return this.proposalService.update(id, dto)
  }
}
