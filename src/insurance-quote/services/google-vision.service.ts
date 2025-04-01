// src/insurance-quote/services/google-vision.service.ts
import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { ImageAnnotatorClient } from '@google-cloud/vision'
import * as fs from 'fs'
import * as path from 'path'
import { v4 as uuid } from 'uuid'

@Injectable()
export class GoogleVisionService {
  private client: ImageAnnotatorClient

  constructor() {
    const credentialsPath = path.resolve(__dirname, '../../../../tmp/gcp-key.json')

    // Garante que as credenciais existam
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
        throw new InternalServerErrorException(
          'Erro ao criar o arquivo de credenciais do Google Vision.',
        )
      }
    }

    this.client = new ImageAnnotatorClient({ keyFilename: credentialsPath })
  }

  async extractTextFromPDF(filePath: string): Promise<string> {
    if (!fs.existsSync(filePath)) {
      console.error('[Vision] ❌ Arquivo não encontrado:', filePath)
      throw new InternalServerErrorException('Arquivo PDF não encontrado para leitura.')
    }

    try {
      const fileSize = fs.statSync(filePath).size
      console.log('[Vision] 📦 Tamanho do arquivo PDF:', fileSize, 'bytes')

      console.log('[Vision] 🔍 Iniciando leitura com Google Vision:', filePath)
      const [result] = await this.client.documentTextDetection(filePath)

      const extracted = result.fullTextAnnotation?.text || ''
      console.log('[Vision] ✅ Texto extraído com sucesso!')
      console.log('[Vision] 🔤 Primeiros 300 caracteres:\n', extracted.slice(0, 300))

      // Salvar JSON completo do resultado para análise
      const debugDir = './uploads/extracted-debug'
      fs.mkdirSync(debugDir, { recursive: true })
      const debugPath = path.join(debugDir, `${uuid()}-vision.json`)
      fs.writeFileSync(debugPath, JSON.stringify(result, null, 2))
      console.log('[Vision] 💾 JSON salvo para depuração em:', debugPath)

      return extracted
    } catch (error) {
      console.error('[Vision] ❌ Erro ao processar PDF com Vision API:', error)
      throw new InternalServerErrorException('Erro ao processar PDF com Google Vision.')
    }
  }
}
