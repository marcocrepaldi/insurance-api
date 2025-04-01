// src/insurance-quote/dto/update-insurance-quote.dto.ts
import { PartialType } from '@nestjs/mapped-types'
import { CreateInsuranceQuoteDto } from './create-insurance-quote.dto'

export class UpdateInsuranceQuoteDto extends PartialType(CreateInsuranceQuoteDto) {}
