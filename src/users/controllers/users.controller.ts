import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Delete, 
  Patch, 
  UseGuards 
} from "@nestjs/common";
import { UsersService } from "../services/users.service";
import { CreateUserDto } from "../dto/create-user.dto";
import { UpdateUserDto } from "../dto/update-user.dto";
import { AuthGuard } from "@nestjs/passport";
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from "@nestjs/swagger";

@ApiTags("Users") // Agrupa no Swagger
@UseGuards(AuthGuard("jwt")) // Proteção JWT aplicada ao controller inteiro
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: "Criar um novo usuário" })
  @ApiResponse({ status: 201, description: "Usuário criado com sucesso" })
  @ApiResponse({ status: 400, description: "Dados inválidos" })
  @ApiBody({ type: CreateUserDto })
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: "Listar todos os usuários" })
  @ApiResponse({ status: 200, description: "Lista de usuários retornada com sucesso" })
  async findAll() {
    return await this.usersService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "Buscar um usuário por ID" })
  @ApiResponse({ status: 200, description: "Usuário encontrado" })
  @ApiResponse({ status: 404, description: "Usuário não encontrado" })
  @ApiParam({ name: "id", description: "UUID do usuário", type: "string" })
  async findOne(@Param("id") id: string) {
    this.validateUUID(id);
    return await this.usersService.findOne(id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Atualizar um usuário por ID" })
  @ApiResponse({ status: 200, description: "Usuário atualizado com sucesso" })
  @ApiResponse({ status: 400, description: "Dados inválidos" })
  @ApiResponse({ status: 404, description: "Usuário não encontrado" })
  @ApiParam({ name: "id", description: "UUID do usuário", type: "string" })
  @ApiBody({ type: UpdateUserDto })
  async update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    this.validateUUID(id);
    return await this.usersService.update(id, updateUserDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Remover um usuário por ID" })
  @ApiResponse({ status: 204, description: "Usuário removido com sucesso" })
  @ApiResponse({ status: 404, description: "Usuário não encontrado" })
  @ApiParam({ name: "id", description: "UUID do usuário", type: "string" })
  async remove(@Param("id") id: string) {
    this.validateUUID(id);
    return await this.usersService.remove(id);
  }

  // Função para validar UUID manualmente
  private validateUUID(id: string) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      throw new Error("ID inválido. Deve ser um UUID válido.");
    }
  }
}
