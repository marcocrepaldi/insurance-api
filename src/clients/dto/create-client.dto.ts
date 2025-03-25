import { IsOptional, IsString, IsEmail, IsDateString, IsBoolean, IsArray, IsUUID } from 'class-validator';

export class CreateClientDto {
  @IsString()
  name: string;

  @IsString()
  document: string;

  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  street?: string;

  @IsOptional()
  @IsString()
  number?: string;

  @IsOptional()
  @IsString()
  complement?: string;

  @IsOptional()
  @IsString()
  neighborhood?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  zipCode?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  documents?: string[];

  @IsOptional()
  @IsUUID()
  indicatedById?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
