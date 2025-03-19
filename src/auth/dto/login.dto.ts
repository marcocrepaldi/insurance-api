// src/auth/dto/login.dto.ts
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class LoginDto {
  @IsEmail({}, { message: "E-mail inválido." })
  email: string;

  @IsNotEmpty({ message: "A senha é obrigatória." })
  @IsString()
  @MinLength(8, { message: "A senha deve ter no mínimo 8 caracteres." })
  password: string;
}
