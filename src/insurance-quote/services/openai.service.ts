// src/insurance-quote/services/openai.service.ts
import { Injectable, InternalServerErrorException } from '@nestjs/common'
import OpenAI from 'openai'

@Injectable()
export class OpenAiService {
  private openai: OpenAI

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      throw new Error('A variável OPENAI_API_KEY não está definida.')
    }

    this.openai = new OpenAI({ apiKey })
  }

  async analyzeProposalText(extractedText: string): Promise<{
    insurerName: string
    totalPremium: number
    insuredAmount: number
    observations: string
    coverages: { name: string; value: number; deductible?: string }[]
  }> {
    const prompt = `Você receberá o texto bruto extraído de uma proposta de seguro. 
Extraia e retorne os dados no seguinte formato JSON:

{
  insurerName: string,
  totalPremium: number,
  insuredAmount: number,
  observations: string,
  coverages: Array<{ name: string; value: number; deductible?: string }>
}

Texto da proposta:
\"\"\"
${extractedText}
\"\"\"`

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'Você é um assistente que extrai informações estruturadas de propostas de seguro em português.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.2,
      })

      const content = response.choices[0].message?.content || ''
      return JSON.parse(content)
    } catch (error) {
      console.error('[OpenAI] ❌ Erro ao analisar texto:', error)
      throw new InternalServerErrorException('Erro ao analisar a proposta com o ChatGPT.')
    }
  }
}
