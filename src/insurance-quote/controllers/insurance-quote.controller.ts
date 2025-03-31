// src/insurance-quote/controllers/insurance-quote.controller.ts
import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Patch,
    Delete,
  } from '@nestjs/common';
  import { InsuranceQuoteService } from '../services/insurance-quote.service';
  import { CreateInsuranceQuoteDto } from '../dto/create-insurance-quote.dto';
  import { UpdateInsuranceQuoteDto } from '../dto/update-insurance-quote.dto';
  
  @Controller('api/insurance-quotes')
  export class InsuranceQuoteController {
    constructor(private readonly service: InsuranceQuoteService) {}
  
    @Post()
    create(@Body() dto: CreateInsuranceQuoteDto) {
      return this.service.create(dto);
    }
  
    @Get()
    findAll() {
      return this.service.findAll();
    }
  
    @Get(':id')
    findOne(@Param('id') id: string) {
      return this.service.findOne(id);
    }
  
    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: UpdateInsuranceQuoteDto) {
      return this.service.update(id, dto);
    }
  
    @Delete(':id')
    remove(@Param('id') id: string) {
      return this.service.remove(id);
    }
  }
  