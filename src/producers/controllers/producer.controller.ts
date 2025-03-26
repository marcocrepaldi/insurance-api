import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    Put,
    UseGuards,
  } from '@nestjs/common';
  import { ProducerService } from '../services/producer.service';
  import { CreateProducerDto } from '../dto/create-producer.dto';
  import { UpdateProducerDto } from '../dto/update-producer.dto';
  import { AuthGuard } from '@nestjs/passport';
  
  @Controller('producers')
  @UseGuards(AuthGuard('jwt'))
  export class ProducerController {
    constructor(private readonly producerService: ProducerService) {}
  
    @Post()
    create(@Body() dto: CreateProducerDto) {
      return this.producerService.create(dto);
    }
  
    @Get()
    findAll() {
      return this.producerService.findAll();
    }
  
    @Get(':id')
    findOne(@Param('id') id: string) {
      return this.producerService.findOne(id);
    }
  
    @Put(':id')
    update(@Param('id') id: string, @Body() dto: UpdateProducerDto) {
      return this.producerService.update(id, dto);
    }
  
    @Delete(':id')
    remove(@Param('id') id: string) {
      return this.producerService.remove(id);
    }
  }
  