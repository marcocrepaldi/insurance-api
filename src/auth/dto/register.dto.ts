// src/auth/dto/register.dto.ts
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  IsUUID,
} from 'class-validator';

export class RegisterDto {
  @IsNotEmpty({ message: 'O nome é obrigatório.' })
  @IsString()
  @MaxLength(100, { message: 'O nome não pode ter mais de 100 caracteres.' })
  name: string;

  @IsEmail({}, { message: 'E-mail inválido.' })
  email: string;

  @IsNotEmpty({ message: 'A senha é obrigatória.' })
  @IsString()
  @MinLength(8, { message: 'A senha deve ter pelo menos 8 caracteres.' })
  @MaxLength(64, { message: 'A senha não pode ter mais de 64 caracteres.' })
  password: string;

  @IsUUID()
  @IsNotEmpty({ message: 'O ID da role é obrigatório.' })
  roleId: string;
}
