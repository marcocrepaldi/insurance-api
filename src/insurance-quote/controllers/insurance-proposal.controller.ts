// src/insurance-quote/controllers/insurance-proposal.controller.ts
import {
  Controller,
  Get,
  Param,
  Patch,
  Body,
  UseGuards,
} from '@nestjs/common';
import { InsuranceProposalService } from '../services/insurance-proposal.service';
import { UpdateInsuranceProposalDto } from '../dto/update-insurance-proposal.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('insurance-proposals')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('insurance-quotes/proposals')
export class InsuranceProposalController {
  constructor(private readonly proposalService: InsuranceProposalService) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.proposalService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateInsuranceProposalDto) {
    return this.proposalService.update(id, dto);
  }
}
