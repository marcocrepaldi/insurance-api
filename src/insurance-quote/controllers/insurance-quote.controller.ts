// src/insurance-quote/controllers/insurance-quote.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common'
import { InsuranceQuoteService } from '../services/insurance-quote.service'
import { CreateInsuranceQuoteDto } from '../dto/create-insurance-quote.dto'
import { UpdateInsuranceQuoteDto } from '../dto/update-insurance-quote.dto'
import { AuthGuard } from '@nestjs/passport'
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger'

@ApiTags('Insurance Quotes')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('insurance-quotes')
export class InsuranceQuoteController {
  constructor(private readonly service: InsuranceQuoteService) {}

  @Post()
  @ApiOperation({ summary: 'Criar uma nova cotação de seguro' })
  create(@Body() dto: CreateInsuranceQuoteDto) {
    return this.service.create(dto)
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as cotações' })
  findAll() {
    return this.service.findAll()
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar cotação por ID' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar cotação' })
  update(@Param('id') id: string, @Body() dto: UpdateInsuranceQuoteDto) {
    return this.service.update(id, dto)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover cotação' })
  remove(@Param('id') id: string) {
    return this.service.remove(id)
  }
}
