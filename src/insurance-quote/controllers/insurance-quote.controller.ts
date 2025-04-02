import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  ParseUUIDPipe,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { InsuranceQuoteService } from '../services/insurance-quote.service';
import { CreateInsuranceQuoteDto } from '../dto/create-insurance-quote.dto';
import { UpdateInsuranceQuoteDto } from '../dto/update-insurance-quote.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { InsuranceQuote } from '../entities/insurance-quote.entity';
import { User } from '../../users/entities/user.entity';

@ApiTags('insurance-quotes')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('insurance-quotes')
export class InsuranceQuoteController {
  constructor(private readonly service: InsuranceQuoteService) {}

  @Post()
  @ApiOperation({ summary: 'Criar uma nova cotação de seguro' })
  create(
    @Body() dto: CreateInsuranceQuoteDto,
    @Req() req: Request,
  ): Promise<InsuranceQuote> {
    const user = req.user as User;
    return this.service.create(dto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as cotações' })
  findAll(): Promise<InsuranceQuote[]> {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar cotação por ID' })
  findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<InsuranceQuote> {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar cotação' })
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateInsuranceQuoteDto,
  ): Promise<InsuranceQuote> {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover cotação' })
  remove(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<{ deleted: boolean }> {
    return this.service.remove(id);
  }
}
