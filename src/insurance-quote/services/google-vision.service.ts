// src/insurance-quote/services/google-vision.service.ts
import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { ImageAnnotatorClient } from '@google-cloud/vision'
import * as fs from 'fs'
import * as path from 'path'
import * as mime from 'mime-types'
import * as pdf2img from 'pdf-img-convert'
import { v4 as uuid } from 'uuid'

@Injectable()
export class GoogleVisionService {
  private client: ImageAnnotatorClient

  constructor() {
    const credentialsPath = path.resolve(__dirname, '../../../../tmp/gcp-key.json')

    if (!fs.existsSync(credentialsPath)) {
      const base64 = process.env.GOOGLE_VISION_CREDENTIALS_BASE64
      if (!base64) {
        throw new Error('A variável de ambiente GOOGLE_VISION_CREDENTIALS_BASE64 está ausente.')
      }

      try {
        const decoded = Buffer.from(base64, 'base64').toString('utf-8')
        fs.mkdirSync(path.dirname(credentialsPath), { recursive: true })
        fs.writeFileSync(credentialsPath, decoded)
        console.log('[Vision] ✅ Credenciais geradas com sucesso:', credentialsPath)
      } catch (err) {
        console.error('[Vision] ❌ Falha ao salvar credenciais:', err)
        throw new InternalServerErrorException('Erro ao criar credenciais do Google Vision.')
      }
    }

    this.client = new ImageAnnotatorClient({ keyFilename: credentialsPath })
  }

  async extractTextWithDebug(filePath: string): Promise<{
    extractedText: string
    visionResultJson: any
  }> {
    if (!fs.existsSync(filePath)) {
      throw new InternalServerErrorException('Arquivo não encontrado.')
    }

    const mimeType = mime.lookup(filePath)
    let extractedText = ''
    let fullResult: any = {}

    try {
      if (mimeType === 'application/pdf') {
        console.log('[Vision] 🔄 Convertendo PDF em imagens...')
        const outputDir = path.join('./uploads/temp-images', uuid())
        fs.mkdirSync(outputDir, { recursive: true })

        const images = await pdf2img.convert(filePath)
        if (!images.length) throw new Error('Nenhuma imagem gerada a partir do PDF.')

        console.log(`[Vision] 📄 ${images.length} página(s) convertidas.`)

        for (const [index, imageBuffer] of images.entries()) {
          const tempImagePath = path.join(outputDir, `page-${index + 1}.png`)
          fs.writeFileSync(tempImagePath, imageBuffer)
          const [result] = await this.client.textDetection(tempImagePath)
          const text = result.fullTextAnnotation?.text || ''
          extractedText += '\n' + text
          fullResult[`page_${index + 1}`] = result
        }
      } else {
        console.log('[Vision] 🖼️ Lendo imagem com Google Vision:', filePath)
        const [result] = await this.client.textDetection(filePath)
        extractedText = result.fullTextAnnotation?.text || ''
        fullResult = result
      }

      console.log('[Vision] ✅ Texto extraído com sucesso.')
      console.log('[Vision] 🔤 Texto (prévia):\n', extractedText.slice(0, 300))

      // Salvar JSON bruto para depuração
      const debugDir = './uploads/extracted-debug'
      fs.mkdirSync(debugDir, { recursive: true })
      const debugFilePath = path.join(debugDir, `${uuid()}-vision.json`)
      fs.writeFileSync(debugFilePath, JSON.stringify(fullResult, null, 2))
      console.log('[Vision] 💾 Resultado salvo em:', debugFilePath)

      return {
        extractedText: extractedText.trim(),
        visionResultJson: fullResult,
      }
    } catch (error) {
      console.error('[Vision] ❌ Erro ao processar arquivo:', error)
      throw new InternalServerErrorException('Erro ao processar arquivo com Google Vision.')
    }
  }
}
