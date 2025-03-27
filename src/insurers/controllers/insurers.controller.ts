import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    ParseUUIDPipe,
  } from '@nestjs/common';
  import { InsurersService } from '../services/insurers.service';
  import { CreateInsurerDto } from '../dto/create-insurer.dto';
  import { UpdateInsurerDto } from '../dto/update-insurer.dto';
  import { AuthGuard } from '@nestjs/passport';
  
  @UseGuards(AuthGuard('jwt'))
  @Controller('insurers')
  export class InsurersController {
    constructor(private readonly insurersService: InsurersService) {}
  
    @Post()
    create(@Body() dto: CreateInsurerDto) {
      return this.insurersService.create(dto);
    }
  
    @Get()
    findAll() {
      return this.insurersService.findAll();
    }
  
    @Get(':id')
    findOne(@Param('id', new ParseUUIDPipe()) id: string) {
      return this.insurersService.findOne(id);
    }
  
    @Patch(':id')
    update(
      @Param('id', new ParseUUIDPipe()) id: string,
      @Body() dto: UpdateInsurerDto,
    ) {
      return this.insurersService.update(id, dto);
    }
  
    @Delete(':id')
    remove(@Param('id', new ParseUUIDPipe()) id: string) {
      return this.insurersService.remove(id);
    }
  }
  