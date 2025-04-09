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
import { fromPath } from 'pdf2pic'

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

    console.log('\n[Upload] 🧠 Verificando tipo de arquivo...')

    // 🔍 Detecta se é PDF
    const isPdf = path.extname(file.path).toLowerCase() === '.pdf'
    let fileForVision = file.path

    if (isPdf) {
      console.log('[Upload] 📄 É um PDF. Iniciando conversão...')

      const outputFolder = path.join(process.cwd(), 'uploads/temp')
      if (!fs.existsSync(outputFolder)) {
        fs.mkdirSync(outputFolder, { recursive: true })
      }

      const converter = fromPath(file.path, {
        density: 300,
        saveFilename: `page-${uuid()}`,
        savePath: outputFolder,
        format: 'png',
      })

      try {
        const result = await converter(1)
        fileForVision = result.path
        console.log('[Upload] ✅ PDF convertido em imagem:', fileForVision)
      } catch (error) {
        console.error('[Upload] ❌ Erro ao converter PDF para imagem:', error)
        throw new BadRequestException('Erro ao converter PDF para imagem.')
      }
    }

    console.log('[Upload] 🔍 Enviando arquivo para OCR com Vision...')
    const { extractedText, visionResultJson } =
      await this.visionService.extractTextWithDebug(fileForVision)

    console.log('[Upload] ✅ OCR concluído.')
    console.log('[Upload] 📝 Texto extraído (trecho):\n', extractedText.slice(0, 300))

    // 🔒 Validação e preenchimento seguro
    dto.totalPremium = Number(dto.totalPremium) || 0
    dto.insuredAmount = Number(dto.insuredAmount) || 0
    dto.pdfPath = file.path
    dto.coverages = []

    dto.observations =
      extractedText && extractedText.trim().length > 0
        ? extractedText.slice(0, 500)
        : 'Texto extraído estava vazio ou ilegível.'

    // 💾 Salva proposta no banco
    const proposal = await this.proposalService.create(dto)

    // 🔁 Retorna todos os dados úteis
    return {
      proposal,
      extractedText,
      visionResultJson,
    }
  }
}
