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
  import { IsUUID } from "class-validator";
  
  @UseGuards(AuthGuard("jwt")) // Protege todas as rotas
  @Controller("roles")
  export class RolesController {
    constructor(private readonly rolesService: RolesService) {}
  
    @Post()
    async create(@Body() createRoleDto: CreateRoleDto) {
      return await this.rolesService.create(createRoleDto);
    }
  
    @Get()
    async findAll() {
      return await this.rolesService.findAll();
    }
  
    @Get(":id")
    async findOne(@Param("id") id: string) {
      if (!IsUUID("4", { each: true })) {
        throw new Error("ID inválido.");
      }
      return await this.rolesService.findOne(id);
    }
  
    @Patch(":id")
    async update(@Param("id") id: string, @Body() updateRoleDto: UpdateRoleDto) {
      if (!IsUUID("4", { each: true })) {
        throw new Error("ID inválido.");
      }
      return await this.rolesService.update(id, updateRoleDto);
    }
  
    @Delete(":id")
    @HttpCode(204)
    async remove(@Param("id") id: string) {
      if (!IsUUID("4", { each: true })) {
        throw new Error("ID inválido.");
      }
      await this.rolesService.remove(id);
    }
  }
  