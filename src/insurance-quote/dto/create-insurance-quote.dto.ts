import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  IsNumber,
  IsArray,
  IsDateString,
  ValidateNested,
  IsObject,
} from 'class-validator'
import { Transform, Type } from 'class-transformer'
import { QuoteStage, QuoteServiceType } from '../entities/insurance-quote.entity'

export class CreateInsuranceQuoteDto {
  @IsString()
  @IsNotEmpty()
  title: string

  @IsOptional()
  @IsString()
  description?: string

  @IsOptional()
  @IsEnum(QuoteStage)
  stage?: QuoteStage

  @IsEnum(QuoteServiceType)
  @IsNotEmpty()
  serviceType: QuoteServiceType

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

  // 👇 Novo campo para dados dinâmicos do produto (validado externamente)
  @IsOptional()
  @IsObject()
  serviceDetails?: Record<string, any>
}
