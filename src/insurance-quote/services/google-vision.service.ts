import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { ImageAnnotatorClient } from '@google-cloud/vision'
import * as fs from 'fs'
import * as path from 'path'
import * as mime from 'mime-types'
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
    let visionResultJson: any = {}

    try {
      if (!mimeType?.startsWith('image/')) {
        console.warn('[Vision] ⚠️ Formato não suportado:', mimeType)
        throw new InternalServerErrorException('Somente imagens são suportadas no momento.')
      }

      console.log('[Vision] 🖼️ Lendo imagem com Google Vision:', filePath)
      const [result] = await this.client.textDetection(filePath)
      extractedText = result.fullTextAnnotation?.text || ''
      visionResultJson = result

      // 🧪 Salva resultado em JSON para debug
      const debugDir = './uploads/extracted-debug'
      fs.mkdirSync(debugDir, { recursive: true })
      const debugFilePath = path.join(debugDir, `${uuid()}-vision.json`)
      fs.writeFileSync(debugFilePath, JSON.stringify(visionResultJson, null, 2))
      console.log('[Vision] 💾 Resultado salvo em:', debugFilePath)

      return {
        extractedText: extractedText.trim(),
        visionResultJson,
      }
    } catch (error) {
      console.error('[Vision] ❌ Erro ao processar imagem:', error)
      throw new InternalServerErrorException('Erro ao processar imagem com Google Vision.')
    }
  }
}
