// src/insurance-quote/dto/create-insurance-quote.dto.ts
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  IsNumber,
  IsArray,
  IsDateString,
} from 'class-validator'
import { QuoteStage } from '../entities/insurance-quote.entity'
import { Transform } from 'class-transformer'

export class CreateInsuranceQuoteDto {
  @IsNotEmpty()
  @IsString()
  title: string

  @IsOptional()
  @IsString()
  description?: string

  @IsOptional()
  @IsEnum(QuoteStage)
  stage?: QuoteStage

  @IsOptional()
  @IsDateString()
  proposalSentAt?: Date

  @IsOptional()
  @IsDateString()
  expectedDecisionDate?: Date

  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  expectedPremium?: number

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  suggestedProducts?: string[]

  @IsUUID()
  clientId: string

  @IsUUID()
  producerId: string

  @IsOptional()
  @IsUUID()
  createdBy?: string
}
