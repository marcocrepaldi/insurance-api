import { IsNotEmpty, IsString, IsOptional, IsArray, IsObject, IsNumberString } from 'class-validator';

export class CreateInsurerDto {
  @IsNotEmpty()
  @IsString()
  nomeFantasia: string;

  @IsNotEmpty()
  @IsString()
  razaoSocial: string;

  @IsNotEmpty()
  @IsString()
  @IsNumberString()
  cnpj: string;

  @IsOptional()
  @IsString()
  inscricaoEstadual?: string;

  @IsOptional()
  @IsString()
  registroSusep?: string;

  @IsOptional()
  @IsString()
  endereco?: string;

  @IsOptional()
  @IsString()
  contato?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  produtosOferecidos?: string[];

  @IsOptional()
  @IsObject()
  comissoes?: Record<string, number>;

  @IsOptional()
  @IsString()
  logoPath?: string;
}
