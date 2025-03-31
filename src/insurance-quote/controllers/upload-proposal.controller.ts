import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GoogleVisionService } from '../services/google-vision.service';
import { CreateInsuranceProposalDto } from '../dto/create-insurance-proposal.dto';
import { InsuranceProposalService } from '../services/insurance-proposal.service';
import { diskStorage } from 'multer';
import { v4 as uuid } from 'uuid';
import * as path from 'path';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('insurance-proposals')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('insurance-quotes/proposals')
export class UploadProposalController {
  constructor(
    private readonly visionService: GoogleVisionService,
    private readonly proposalService: InsuranceProposalService,
  ) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/proposals',
        filename: (req, file, cb) => {
          const ext = path.extname(file.originalname);
          cb(null, `${uuid()}${ext}`);
        },
      }),
    }),
  )
  async uploadAndProcess(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateInsuranceProposalDto,
  ) {
    console.log('[Upload] Iniciando leitura com Google Vision...');
    const extractedText = await this.visionService.extractTextFromPDF(file.path);
    console.log('[Upload] Texto extraído com sucesso!');

    dto.pdfPath = file.path;
    dto.observations = extractedText?.slice(0, 500) || 'Nenhuma observação extraída.';
    dto.coverages = [];
    dto.totalPremium = 0;
    dto.insuredAmount = 0;

    console.log('[Upload] Salvando proposta no banco de dados...');
    return this.proposalService.create(dto);
  }
}
