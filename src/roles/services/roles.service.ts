import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../entities/role.entity';
import { CreateRoleDto } from '../dto/create-role.dto';
import { UpdateRoleDto } from '../dto/update-role.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    try {
      const existingRole = await this.roleRepository.findOne({
        where: { name: createRoleDto.name },
      });

      if (existingRole) {
        throw new ConflictException('Esta role já existe.');
      }

      const newRole = this.roleRepository.create(createRoleDto);
      return await this.roleRepository.save(newRole);
    } catch (error) {
      console.error('Erro ao criar role:', error); // Log para depuração
      throw new InternalServerErrorException('Erro ao criar role.');
    }
  }

  async findAll(): Promise<Role[]> {
    try {
      return await this.roleRepository.find();
    } catch (error) {
      console.error('Erro ao listar roles:', error);
      throw new InternalServerErrorException('Erro ao listar roles.');
    }
  }

  async findOne(id: string): Promise<Role> {
    try {
      const role = await this.roleRepository.findOne({ where: { id } });

      if (!role) {
        throw new NotFoundException('Role não encontrada.');
      }

      return role;
    } catch (error) {
      console.error(`Erro ao buscar role com ID ${id}:`, error);
      throw new InternalServerErrorException('Erro ao buscar role.');
    }
  }

  async update(id: string, updateRoleDto: UpdateRoleDto): Promise<Role> {
    try {
      const role = await this.findOne(id);
      Object.assign(role, updateRoleDto);
      await this.roleRepository.save(role);
      return role;
    } catch (error) {
      console.error(`Erro ao atualizar role com ID ${id}:`, error);
      throw new InternalServerErrorException('Erro ao atualizar role.');
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    const role = await this.findOne(id);

    try {
      await this.roleRepository.remove(role);
      return { message: 'Role removida com sucesso.' };
    } catch (error) {
      console.error(`Erro ao remover role com ID ${id}:`, error);
      throw new ConflictException(
        'Não é possível excluir a role pois há usuários vinculados a ela.',
      );
    }
  }
}
