import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateRoleDto {
  @IsNotEmpty({ message: "O nome da role é obrigatório." })
  @IsString({ message: "O nome da role deve ser uma string." })
  @MaxLength(50, { message: "O nome da role não pode ter mais de 50 caracteres." })
  name: string;
}
