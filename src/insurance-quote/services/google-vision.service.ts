import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ImageAnnotatorClient } from '@google-cloud/vision';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class GoogleVisionService {
  private client: ImageAnnotatorClient;

  constructor() {
    const credentialsPath = path.resolve(__dirname, '../../../GoogleCloudVision/neat-fin-336618-83b16963d844.json');

    if (!fs.existsSync(credentialsPath)) {
      throw new Error(`Arquivo de credenciais Google Vision não encontrado em: ${credentialsPath}`);
    }

    this.client = new ImageAnnotatorClient({
      keyFilename: credentialsPath,
    });
  }

  async extractTextFromPDF(filePath: string): Promise<string> {
    if (!fs.existsSync(filePath)) {
      throw new InternalServerErrorException('Arquivo PDF não encontrado para leitura.');
    }

    try {
      const [result] = await this.client.documentTextDetection(filePath);

      if (!result.fullTextAnnotation?.text) {
        console.warn('⚠️ Nenhum texto detectado no PDF.');
        return '';
      }

      return result.fullTextAnnotation.text;
    } catch (error) {
      console.error('❌ Erro ao extrair texto com Google Vision:', error?.message || error);
      throw new InternalServerErrorException('Erro ao processar o PDF com Google Vision.');
    }
  }
}
