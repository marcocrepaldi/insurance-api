import { 
    IsEmail, 
    IsNotEmpty, 
    IsString, 
    MinLength, 
    MaxLength, 
    IsUUID 
  } from "class-validator";
  
  export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(100)
    name: string;
  
    @IsEmail()
    @IsNotEmpty()
    @MaxLength(255)
    email: string;
  
    @IsNotEmpty()
    @IsString()
    @MinLength(8, { message: "A senha deve ter pelo menos 8 caracteres." })
    @MaxLength(64, { message: "A senha não pode ter mais de 64 caracteres." })
    password: string;
  
    @IsUUID()
    @IsNotEmpty()
    roleId: string;
  }
  