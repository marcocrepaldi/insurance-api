// src/insurance-quote/dto/create-insurance-proposal.dto.ts
import { IsUUID, IsNotEmpty, IsNumber, IsString, IsOptional, IsArray } from 'class-validator'

export class CreateInsuranceProposalDto {
  @IsUUID()
  quoteId: string

  @IsString()
  @IsNotEmpty()
  insurerName: string

  @IsNumber()
  totalPremium: number

  @IsNumber()
  insuredAmount: number

  @IsOptional()
  @IsString()
  observations?: string

  @IsOptional()
  @IsString()
  pdfPath?: string

  @IsOptional()
  @IsArray()
  coverages?: {
    name: string
    value: number
    deductible?: string
  }[]
}
