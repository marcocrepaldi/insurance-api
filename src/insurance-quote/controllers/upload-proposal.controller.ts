// src/insurance-quote/controllers/upload-proposal.controller.ts
import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
  UseGuards,
  BadRequestException,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { GoogleVisionService } from '../services/google-vision.service'
import { CreateInsuranceProposalDto } from '../dto/create-insurance-proposal.dto'
import { InsuranceProposalService } from '../services/insurance-proposal.service'
import { diskStorage } from 'multer'
import { v4 as uuid } from 'uuid'
import * as path from 'path'
import * as fs from 'fs'
import { AuthGuard } from '@nestjs/passport'
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger'

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
  @ApiOperation({
    summary: 'Fazer upload de proposta (imagem ou PDF) e processar com Google Vision',
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/proposals',
        filename: (req, file, cb) => {
          const ext = path.extname(file.originalname)
          cb(null, `${uuid()}${ext}`)
        },
      }),
    }),
  )
  async uploadAndProcess(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateInsuranceProposalDto,
  ): Promise<any> {
    if (!file) {
      throw new BadRequestException('Arquivo não enviado.')
    }

    console.log('\n[Upload] 🧠 Enviando arquivo para análise...')
    const { extractedText, visionResultJson } =
      await this.visionService.extractTextWithDebug(file.path)

    console.log('[Upload] ✅ Análise concluída.')
    console.log('[Upload] 📝 Trecho do texto extraído:\n', extractedText.slice(0, 300))

    // 🔒 Garante valores seguros e consistentes
    dto.totalPremium = Number(dto.totalPremium) || 0
    dto.insuredAmount = Number(dto.insuredAmount) || 0
    dto.pdfPath = file.path
    dto.coverages = []

    // ✍️ Observações a partir do OCR
    dto.observations =
      extractedText && extractedText.trim().length > 0
        ? extractedText.slice(0, 500)
        : 'Texto extraído estava vazio ou ilegível.'

    // 💾 Persistência no banco
    const proposal = await this.proposalService.create(dto)

    // 📤 Retorno completo com proposta + texto + debug JSON
    return {
      proposal,
      extractedText,
      visionResultJson,
    }
  }
}
