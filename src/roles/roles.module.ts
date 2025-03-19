import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { RolesService } from './services/roles.service';
import { RolesController } from './controllers/roles.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Role])], // ✅ Registrando a entidade Role
  controllers: [RolesController], // ✅ Adicionando o Controller para expor os endpoints
  providers: [RolesService], // ✅ Registrando o Service para manipulação de roles
  exports: [TypeOrmModule, RolesService], // ✅ Exportando para que outros módulos possam usar
})
export class RolesModule {}
