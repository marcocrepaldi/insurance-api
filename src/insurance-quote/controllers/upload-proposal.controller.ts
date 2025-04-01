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
  @ApiOperation({ summary: 'Fazer upload de proposta em PDF e processar com IA' })
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
      throw new BadRequestException('Arquivo PDF não enviado.')
    }

    console.log('\n[Upload] Iniciando leitura com Google Vision...')
    const extractedText = await this.visionService.extractTextFromPDF(file.path)
    console.log('[Vision] ✅ Texto extraído com sucesso!')
    console.log('[Vision] 🔤 Texto extraído completo:\n', extractedText)

    // 🔍 Salva uma cópia do texto extraído para debug futuro
    const txtPath = `./uploads/extracted-text/${uuid()}.txt`
    fs.mkdirSync(path.dirname(txtPath), { recursive: true })
    fs.writeFileSync(txtPath, extractedText || '')
    console.log(`[Vision] 💾 Texto salvo para análise em: ${txtPath}`)

    // ✅ Conversão segura dos campos numéricos
    dto.totalPremium = Number(dto.totalPremium) || 0
    dto.insuredAmount = Number(dto.insuredAmount) || 0
    dto.pdfPath = file.path

    // 🧠 Observações com fallback
    dto.observations =
      extractedText && extractedText.trim().length > 0
        ? extractedText.slice(0, 500)
        : 'Texto extraído estava vazio ou ilegível.'

    // 🧩 Coberturas vazias por enquanto
    dto.coverages = []

    console.log('[Upload] 💾 Salvando proposta no banco de dados...')
    return this.proposalService.create(dto)
  }
}
