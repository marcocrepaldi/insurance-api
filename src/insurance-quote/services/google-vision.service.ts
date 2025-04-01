import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { ImageAnnotatorClient } from '@google-cloud/vision'
import * as fs from 'fs'
import * as path from 'path'

@Injectable()
export class GoogleVisionService {
  private client: ImageAnnotatorClient

  constructor() {
    const credentialsPath = path.resolve(__dirname, '../../../../tmp/gcp-key.json')

    // Cria o JSON de credenciais localmente se ainda não existir
    if (!fs.existsSync(credentialsPath)) {
      const base64 = process.env.GOOGLE_VISION_CREDENTIALS_BASE64

      if (!base64) {
        throw new Error('Variável GOOGLE_VISION_CREDENTIALS_BASE64 não está definida.')
      }

      try {
        const decoded = Buffer.from(base64, 'base64').toString('utf-8')
        fs.mkdirSync(path.dirname(credentialsPath), { recursive: true })
        fs.writeFileSync(credentialsPath, decoded)
        console.log('[Vision] Credenciais geradas com sucesso em:', credentialsPath)
      } catch (err) {
        console.error('[Vision] Falha ao escrever credenciais:', err)
        throw new InternalServerErrorException('Falha ao criar arquivo de credenciais do Google Vision.')
      }
    }

    this.client = new ImageAnnotatorClient({ keyFilename: credentialsPath })
  }

  async extractTextFromPDF(filePath: string): Promise<string> {
    if (!fs.existsSync(filePath)) {
      throw new InternalServerErrorException('Arquivo PDF não encontrado para leitura.')
    }

    try {
      console.log('[Vision] Iniciando leitura do PDF:', filePath)
      const [result] = await this.client.documentTextDetection(filePath)
      const extracted = result.fullTextAnnotation?.text || ''
      console.log('[Vision] Texto extraído com sucesso!')

      return extracted
    } catch (error) {
      console.error('[Vision] Erro ao processar PDF:', error)
      throw new InternalServerErrorException('Erro ao processar PDF com Google Vision.')
    }
  }
}
