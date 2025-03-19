// src/auth/dto/refresh-token.dto.ts
import { IsNotEmpty, IsString } from "class-validator";

export class RefreshTokenDto {
  @IsNotEmpty({ message: "O token de refresh é obrigatório." })
  @IsString()
  refreshToken: string;
}
