import { 
    Injectable, 
    NotFoundException, 
    ConflictException 
  } from "@nestjs/common";
  import { InjectRepository } from "@nestjs/typeorm";
  import { Repository } from "typeorm";
  import { Role } from "../entities/role.entity";
  import { CreateRoleDto } from "../dto/create-role.dto";
  import { UpdateRoleDto } from "../dto/update-role.dto";
  
  @Injectable()
  export class RolesService {
    constructor(
      @InjectRepository(Role)
      private readonly roleRepository: Repository<Role>
    ) {}
  
    async create(createRoleDto: CreateRoleDto): Promise<Role> {
      const existingRole = await this.roleRepository.findOne({ where: { name: createRoleDto.name } });
  
      if (existingRole) {
        throw new ConflictException("Esta role já existe.");
      }
  
      const newRole = this.roleRepository.create(createRoleDto);
      return this.roleRepository.save(newRole);
    }
  
    async findAll(): Promise<Role[]> {
      return this.roleRepository.find();
    }
  
    async findOne(id: string): Promise<Role> {
      const role = await this.roleRepository.findOne({ where: { id } });
  
      if (!role) {
        throw new NotFoundException("Role não encontrada.");
      }
  
      return role;
    }
  
    async update(id: string, updateRoleDto: UpdateRoleDto): Promise<Role> {
      const role = await this.findOne(id);
      Object.assign(role, updateRoleDto);
      await this.roleRepository.save(role);
      return role;
    }
  
    async remove(id: string): Promise<{ message: string }> {
      const role = await this.findOne(id);
  
      try {
        await this.roleRepository.remove(role);
        return { message: "Role removida com sucesso." };
      } catch (error) {
        throw new ConflictException("Não é possível excluir a role pois há usuários vinculados a ela.");
      }
    }
  }
  