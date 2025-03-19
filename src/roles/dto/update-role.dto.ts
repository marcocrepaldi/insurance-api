import { PartialType } from "@nestjs/swagger";
import { CreateRoleDto } from "./create-role.dto";
import { IsUUID, IsOptional, MaxLength } from "class-validator";

export class UpdateRoleDto extends PartialType(CreateRoleDto) {
  @IsOptional()
  @IsUUID("4", { message: "O ID deve ser um UUID válido." })
  id?: string;

  @IsOptional()
  @MaxLength(50, { message: "O nome da role não pode ter mais de 50 caracteres." })
  name?: string;
}
