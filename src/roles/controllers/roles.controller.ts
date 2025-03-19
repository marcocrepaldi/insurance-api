import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Delete, 
  Patch, 
  UseGuards, 
  HttpCode 
} from "@nestjs/common";
import { RolesService } from "../services/roles.service";
import { CreateRoleDto } from "../dto/create-role.dto";
import { UpdateRoleDto } from "../dto/update-role.dto";
import { AuthGuard } from "@nestjs/passport";
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from "@nestjs/swagger";

@ApiTags("Roles") // Agrupa no Swagger
@UseGuards(AuthGuard("jwt")) // Protege todas as rotas
@Controller("roles")
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @ApiOperation({ summary: "Criar uma nova role" })
  @ApiResponse({ status: 201, description: "Role criada com sucesso" })
  @ApiResponse({ status: 400, description: "Dados inválidos" })
  @ApiBody({ type: CreateRoleDto })
  async create(@Body() createRoleDto: CreateRoleDto) {
    return await this.rolesService.create(createRoleDto);
  }

  @Get()
  @ApiOperation({ summary: "Listar todas as roles" })
  @ApiResponse({ status: 200, description: "Lista de roles retornada com sucesso" })
  async findAll() {
    return await this.rolesService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "Buscar uma role por ID" })
  @ApiResponse({ status: 200, description: "Role encontrada" })
  @ApiResponse({ status: 404, description: "Role não encontrada" })
  @ApiParam({ name: "id", description: "UUID da role", type: "string" })
  async findOne(@Param("id") id: string) {
    this.validateUUID(id);
    return await this.rolesService.findOne(id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Atualizar uma role por ID" })
  @ApiResponse({ status: 200, description: "Role atualizada com sucesso" })
  @ApiResponse({ status: 400, description: "Dados inválidos" })
  @ApiResponse({ status: 404, description: "Role não encontrada" })
  @ApiParam({ name: "id", description: "UUID da role", type: "string" })
  @ApiBody({ type: UpdateRoleDto })
  async update(@Param("id") id: string, @Body() updateRoleDto: UpdateRoleDto) {
    this.validateUUID(id);
    return await this.rolesService.update(id, updateRoleDto);
  }

  @Delete(":id")
  @HttpCode(204)
  @ApiOperation({ summary: "Remover uma role por ID" })
  @ApiResponse({ status: 204, description: "Role removida com sucesso" })
  @ApiResponse({ status: 404, description: "Role não encontrada" })
  @ApiParam({ name: "id", description: "UUID da role", type: "string" })
  async remove(@Param("id") id: string) {
    this.validateUUID(id);
    await this.rolesService.remove(id);
  }

  // Função para validar UUID manualmente
  private validateUUID(id: string) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      throw new Error("ID inválido. Deve ser um UUID válido.");
    }
  }
}
