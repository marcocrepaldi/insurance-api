import { IsEnum, IsOptional, IsString, IsBoolean, IsEmail, IsObject } from 'class-validator';
import { ProducerType } from '../entities/producer.entity';

export class CreateProducerDto {
  @IsString()
  name: string;

  @IsString()
  cpfCnpj: string;

  @IsString()
  phone: string;

  @IsEmail()
  email: string;

  @IsEnum(ProducerType)
  type: ProducerType;

  @IsOptional()
  @IsObject()
  address?: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };

  @IsOptional()
  @IsString()
  pixKey?: string;

  @IsOptional()
  @IsObject()
  documents?: {
    idDocument?: string;
    taxDocument?: string;
    proofOfAddress?: string;
    others?: string[];
  };

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
