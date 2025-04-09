import {
  Controller,
  Get,
  Param,
  Patch,
  Body,
  UseGuards,
  ParseUUIDPipe,
  Res,
  NotFoundException,
} from '@nestjs/common'
import { Response } from 'express'
import { InsuranceProposalService } from '../services/insurance-proposal.service'
import { UpdateInsuranceProposalDto } from '../dto/update-insurance-proposal.dto'
import { AuthGuard } from '@nestjs/passport'
import { ApiBearerAuth, ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger'
import { InsuranceProposal } from '../entities/insurance-proposal.entity'
import * as fs from 'fs'
import * as path from 'path'

@ApiTags('insurance-proposals')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('insurance-quotes/proposals')
export class InsuranceProposalController {
  constructor(private readonly proposalService: InsuranceProposalService) {}

  // 📄 Download de PDF da proposta
  @Get('pdf/:filename')
  @ApiOperation({ summary: 'Download do PDF da proposta' })
  @ApiParam({ name: 'filename', type: String })
  async downloadPdf(
    @Param('filename') filename: string,
    @Res() res: Response,
  ): Promise<void> {
    const sanitizedFilename = path.basename(filename) // Evita path traversal
    const filePath = path.join(process.cwd(), 'uploads/proposals', sanitizedFilename)

    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('Arquivo PDF não encontrado.')
    }

    res.download(filePath, sanitizedFilename)
  }

  // 🔍 Buscar proposta por ID
  @Get(':id')
  @ApiOperation({ summary: 'Buscar proposta por ID' })
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<InsuranceProposal> {
    return this.proposalService.findOne(id)
  }

  // ✏️ Atualizar proposta por ID
  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar dados da proposta' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateInsuranceProposalDto,
  ): Promise<InsuranceProposal> {
    return this.proposalService.update(id, dto)
  }
}
