import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';
import { User } from './entities/user.entity';
import { Role } from '../roles/entities/role.entity'; // ✅ Certifique-se de importar corretamente
import { RolesModule } from '../roles/roles.module'; // ✅ Importando RolesModule

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role]), // ✅ Agora os repositórios User e Role estão registrados
    RolesModule, // ✅ Importando RolesModule para garantir acesso ao RoleRepository
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
