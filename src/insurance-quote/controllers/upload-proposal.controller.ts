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
import { InsuranceProposalService } from '../services/insurance-proposal.service'
import { OpenAiService } from '../services/openai.service'
import { CreateInsuranceProposalDto } from '../dto/create-insurance-proposal.dto'
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
    private readonly openAiService: OpenAiService,
  ) {}

  @Post('upload')
  @ApiOperation({
    summary: 'Fazer upload de proposta (imagem ou PDF) e processar com Google Vision e ChatGPT',
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

    const fileForVision = file.path

    console.log('[Upload] 🔍 Enviando para OCR com Vision...')
    const { extractedText, visionResultJson } =
      await this.visionService.extractTextWithDebug(fileForVision)

    console.log('[Upload] 🤖 Enviando texto para análise com ChatGPT...')
    const ai = await this.openAiService.analyzeProposalText(extractedText)

    // Preenche automaticamente o DTO com os dados retornados pela IA
    dto.insurerName = ai.insurerName
    dto.totalPremium = Number(ai.totalPremium) || 0
    dto.insuredAmount = Number(ai.insuredAmount) || 0
    dto.coverages = Array.isArray(ai.coverages) ? ai.coverages : []
    dto.observations = ai.observations || extractedText.slice(0, 500)
    dto.pdfPath = file.path

    const proposal = await this.proposalService.create(dto)

    return {
      proposal,
      extractedText,
      parsedByAi: ai,
    }
  }
}
