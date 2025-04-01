// src/insurance-quote/dto/create-insurance-proposal.dto.ts
import {
  IsUUID,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsOptional,
  IsArray,
  ValidateNested,
} from 'class-validator'
import { Type } from 'class-transformer'

class CoverageDto {
  @IsString()
  name: string

  @IsNumber()
  value: number

  @IsOptional()
  @IsString()
  deductible?: string
}

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
  @ValidateNested({ each: true })
  @Type(() => CoverageDto)
  coverages?: CoverageDto[]
}
