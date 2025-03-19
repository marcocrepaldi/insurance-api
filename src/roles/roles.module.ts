import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Role } from "./entities/role.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Role])], // ✅ Registrando a entidade Role
  exports: [TypeOrmModule], // ✅ Exportando para que UsersModule possa acessar
})
export class RolesModule {}
