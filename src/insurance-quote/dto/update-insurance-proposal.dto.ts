// src/insurance-quote/dto/update-insurance-proposal.dto.ts
import {
    IsOptional,
    IsString,
    IsNumber,
    IsArray,
    ValidateNested,
  } from 'class-validator'
  import { Type } from 'class-transformer'
  
  class CoverageItemDto {
    @IsString()
    name: string
  
    @IsNumber()
    value: number
  
    @IsOptional()
    @IsString()
    deductible?: string
  }
  
  export class UpdateInsuranceProposalDto {
    @IsOptional()
    @IsString()
    insurerName?: string
  
    @IsOptional()
    @IsNumber()
    totalPremium?: number
  
    @IsOptional()
    @IsNumber()
    insuredAmount?: number
  
    @IsOptional()
    @IsString()
    observations?: string
  
    @IsOptional()
    @IsString()
    pdfPath?: string
  
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CoverageItemDto)
    coverages?: CoverageItemDto[]
  }
  