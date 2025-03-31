// src/insurance-quote/controllers/upload-proposal.controller.ts
import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
  UseGuards,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { v4 as uuid } from 'uuid';

import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { GoogleVisionService } from '../services/google-vision.service';
import { InsuranceProposalService } from '../services/insurance-proposal.service';
import { CreateInsuranceProposalDto } from '../dto/create-insurance-proposal.dto';

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
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(pdf)$/i)) {
          return cb(
            new BadRequestException('Apenas arquivos PDF são permitidos.'),
            false,
          );
        }
        cb(null, true);
      },
      limits: { fileSize: 5 * 1024 * 1024 }, // limite de 5MB
    }),
  )
  async uploadAndProcess(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateInsuranceProposalDto,
  ) {
    if (!file) {
      throw new BadRequestException('Arquivo não enviado.');
    }

    try {
      console.log('[Upload] Iniciando leitura com Google Vision...');
      const text = await this.visionService.extractTextFromPDF(file.path);
      console.log('[Upload] Texto extraído com sucesso!');

      dto.pdfPath = file.path;
      dto.coverages = []; // você pode preencher isso com NLP futuramente
      dto.insuredAmount = 0;
      dto.totalPremium = 0;
      dto.observations = text.slice(0, 300);

      return this.proposalService.create(dto);
    } catch (error) {
      console.error('[Upload] Erro no processamento:', error);
      throw new InternalServerErrorException(
        'Erro ao processar o PDF e cadastrar a proposta.',
      );
    }
  }
}
