import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Insurer } from '../entities/insurer.entity';
import { CreateInsurerDto } from '../dto/create-insurer.dto';
import { UpdateInsurerDto } from '../dto/update-insurer.dto';

@Injectable()
export class InsurersService {
  constructor(
    @InjectRepository(Insurer)
    private insurerRepository: Repository<Insurer>,
  ) {}

  create(data: CreateInsurerDto): Promise<Insurer> {
    const insurer = this.insurerRepository.create(data);
    return this.insurerRepository.save(insurer);
  }

  findAll(): Promise<Insurer[]> {
    return this.insurerRepository.find();
  }

  async findOne(id: string): Promise<Insurer> {
    const insurer = await this.insurerRepository.findOne({ where: { id } });
    if (!insurer) throw new NotFoundException('Seguradora não encontrada');
    return insurer;
  }

  async update(id: string, data: UpdateInsurerDto): Promise<Insurer> {
    await this.findOne(id);
    await this.insurerRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.insurerRepository.delete(id);
  }
}
