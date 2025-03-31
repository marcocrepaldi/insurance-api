// src/insurance-quote/dto/create-insurance-quote.dto.ts
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, IsNumber, IsArray } from 'class-validator';
import { QuoteStage } from '../entities/insurance-quote.entity';

export class CreateInsuranceQuoteDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(QuoteStage)
  stage?: QuoteStage;

  @IsOptional()
  proposalSentAt?: Date;

  @IsOptional()
  expectedDecisionDate?: Date;

  @IsOptional()
  @IsNumber()
  expectedPremium?: number;

  @IsOptional()
  @IsArray()
  suggestedProducts?: string[];

  @IsUUID()
  clientId: string;

  @IsUUID()
  producerId: string;

  @IsOptional()
  @IsUUID()
  createdBy?: string;
}
