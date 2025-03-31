import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ImageAnnotatorClient } from '@google-cloud/vision';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class GoogleVisionService {
  private client: ImageAnnotatorClient;

  constructor() {
    const credentialsPath = path.resolve(__dirname, '../../../../tmp/gcp-key.json');

    // Cria o JSON a partir da env se ainda não existe
    if (!fs.existsSync(credentialsPath)) {
      const base64 = process.env.GOOGLE_VISION_CREDENTIALS_BASE64;
      if (!base64) throw new Error('Variável GOOGLE_VISION_CREDENTIALS_BASE64 não está definida.');
      const decoded = Buffer.from(base64, 'base64').toString('utf-8');
      fs.mkdirSync(path.dirname(credentialsPath), { recursive: true });
      fs.writeFileSync(credentialsPath, decoded);
    }

    this.client = new ImageAnnotatorClient({ keyFilename: credentialsPath });
  }

  async extractTextFromPDF(filePath: string): Promise<string> {
    if (!fs.existsSync(filePath)) {
      throw new InternalServerErrorException('Arquivo PDF não encontrado para leitura.');
    }

    try {
      const [result] = await this.client.documentTextDetection(filePath);
      return result.fullTextAnnotation?.text || '';
    } catch (error) {
      console.error('Erro ao processar PDF com Google Vision:', error);
      throw new InternalServerErrorException('Erro ao processar PDF com Google Vision.');
    }
  }
}
