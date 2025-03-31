// src/insurance-quote/controllers/upload-proposal.controller.ts
import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GoogleVisionService } from '../services/google-vision.service';
import { CreateInsuranceProposalDto } from '../dto/create-insurance-proposal.dto'; // ✅ Correto aqui!
import { InsuranceProposalService } from '../services/insurance-proposal.service';
import { diskStorage } from 'multer';
import { v4 as uuid } from 'uuid';
import * as path from 'path';

@Controller('api/insurance-quotes/proposals')
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
    const text = await this.visionService.extractTextFromPDF(file.path);

    // TODO: Mapear o texto para os campos abaixo com inteligência
    dto.pdfPath = file.path;
    dto.coverages = [];
    dto.insuredAmount = 0;
    dto.totalPremium = 0;
    dto.observations = text.slice(0, 300); // Pré-visualização

    return this.proposalService.create(dto);
  }
}
