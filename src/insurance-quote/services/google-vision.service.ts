// src/insurance-quote/services/google-vision.service.ts
import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { ImageAnnotatorClient } from '@google-cloud/vision'
import * as fs from 'fs'
import * as path from 'path'
import * as os from 'os'
import { v4 as uuid } from 'uuid'
import { PdfConverter } from 'pdf-poppler'

@Injectable()
export class GoogleVisionService {
  private client: ImageAnnotatorClient

  constructor() {
    const credentialsPath = path.resolve(__dirname, '../../../../tmp/gcp-key.json')

    if (!fs.existsSync(credentialsPath)) {
      const base64 = process.env.GOOGLE_VISION_CREDENTIALS_BASE64

      if (!base64) {
        throw new Error('A variável GOOGLE_VISION_CREDENTIALS_BASE64 está ausente.')
      }

      try {
        const decoded = Buffer.from(base64, 'base64').toString('utf-8')
        fs.mkdirSync(path.dirname(credentialsPath), { recursive: true })
        fs.writeFileSync(credentialsPath, decoded)
        console.log('[Vision] ✅ Credenciais salvas em:', credentialsPath)
      } catch (err) {
        console.error('[Vision] ❌ Erro ao salvar credenciais:', err)
        throw new InternalServerErrorException('Falha ao criar o arquivo de credenciais.')
      }
    }

    this.client = new ImageAnnotatorClient({ keyFilename: credentialsPath })
  }

  async extractTextFromPDF(filePath: string): Promise<string> {
    if (!fs.existsSync(filePath)) {
      console.error('[Vision] ❌ Arquivo não encontrado:', filePath)
      throw new InternalServerErrorException('Arquivo PDF não encontrado.')
    }

    try {
      console.log('[Vision] 🧩 Convertendo PDF para imagens...')

      const tempDir = path.join(os.tmpdir(), uuid())
      fs.mkdirSync(tempDir, { recursive: true })

      const converter = new PdfConverter(filePath)
      await converter.convert(tempDir, {
        format: 'jpeg',
        out_prefix: 'page',
        page: null,
      })

      const imageFiles = fs.readdirSync(tempDir).filter(f => f.endsWith('.jpg'))

      if (imageFiles.length === 0) {
        console.warn('[Vision] ⚠️ Nenhuma imagem gerada a partir do PDF.')
        throw new InternalServerErrorException('Falha ao converter PDF em imagem.')
      }

      console.log(`[Vision] 🖼️ ${imageFiles.length} página(s) convertidas.`)

      let combinedText = ''

      for (const img of imageFiles) {
        const imagePath = path.join(tempDir, img)
        console.log(`[Vision] 🔍 Processando imagem: ${imagePath}`)

        const [result] = await this.client.textDetection(imagePath)
        const text = result.fullTextAnnotation?.text || ''
        combinedText += '\n' + text
      }

      console.log('[Vision] ✅ Extração de texto concluída.')
      return combinedText.trim()
    } catch (error) {
      console.error('[Vision] ❌ Erro ao processar PDF:', error)
      throw new InternalServerErrorException('Erro ao processar PDF com Google Vision.')
    }
  }
}
