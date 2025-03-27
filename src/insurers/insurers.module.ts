import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InsurersService } from './services/insurers.service';
import { InsurersController } from './controllers/insurers.controller';
import { Insurer } from './entities/insurer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Insurer])],
  controllers: [InsurersController],
  providers: [InsurersService],
  exports: [InsurersService],
})
export class InsurersModule {}
