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
        throw new Error('A variável de ambiente GOOGLE_VISION_CREDENTIALS_BASE64 está ausente.')
      }

      try {
        const decoded = Buffer.from(base64, 'base64').toString('utf-8')
        fs.mkdirSync(path.dirname(credentialsPath), { recursive: true })
        fs.writeFileSync(credentialsPath, decoded)
        console.log('[Vision] ✅ Credenciais geradas com sucesso:', credentialsPath)
      } catch (err) {
        console.error('[Vision] ❌ Falha ao escrever credenciais:', err)
        throw new InternalServerErrorException('Erro ao criar o arquivo de credenciais do Google Vision.')
      }
    }

    this.client = new ImageAnnotatorClient({ keyFilename: credentialsPath })
  }

  async extractTextFromPDF(filePath: string): Promise<string> {
    if (!fs.existsSync(filePath)) {
      throw new InternalServerErrorException('Arquivo PDF não encontrado para leitura.')
    }

    try {
      console.log('[Vision] 🧩 Convertendo PDF em imagens...')
      const outputDir = path.join(os.tmpdir(), uuid())
      fs.mkdirSync(outputDir, { recursive: true })

      const converter = new PdfConverter(filePath)
      await converter.convert(outputDir, {
        format: 'jpeg',
        out_prefix: 'page',
        page: null, // todas as páginas
      })

      const files = fs.readdirSync(outputDir).filter((f) => f.endsWith('.jpg'))
      if (files.length === 0) {
        throw new Error('Nenhuma imagem foi gerada a partir do PDF.')
      }

      console.log(`[Vision] 📄 ${files.length} página(s) convertidas.`)

      let finalText = ''

      for (const file of files) {
        const imagePath = path.join(outputDir, file)
        console.log(`[Vision] 🔍 Lendo imagem: ${imagePath}`)

        const [result] = await this.client.textDetection(imagePath)
        const text = result.fullTextAnnotation?.text || ''
        finalText += '\n' + text
      }

      console.log('[Vision] ✅ OCR finalizado com sucesso.')
      return finalText.trim()
    } catch (error) {
      console.error('[Vision] ❌ Erro ao converter ou ler PDF:', error)
      throw new InternalServerErrorException('Erro ao processar PDF com Google Vision.')
    }
  }
}
