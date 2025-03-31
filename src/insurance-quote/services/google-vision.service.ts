import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ImageAnnotatorClient } from '@google-cloud/vision';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class GoogleVisionService {
  private client: ImageAnnotatorClient;

  constructor() {
    this.client = new ImageAnnotatorClient({
      keyFilename: path.join(__dirname, '../../../GoogleCloudVision/neat-fin-336618-06ff1f75bcb.json'),
    });
  }

  async extractTextFromPDF(filePath: string): Promise<string> {
    if (!fs.existsSync(filePath)) {
      throw new InternalServerErrorException('Arquivo não encontrado para leitura.');
    }

    try {
      const [result] = await this.client.documentTextDetection(filePath);
      const fullText = result.fullTextAnnotation?.text || '';
      return fullText;
    } catch (error) {
      console.error('Erro ao extrair texto do PDF:', error);
      throw new InternalServerErrorException('Erro ao processar o PDF com Google Vision.');
    }
  }
}
