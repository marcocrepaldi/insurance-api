import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // ✅ Carrega variáveis do .env automaticamente
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const databaseUrl = configService.get<string>('DATABASE_URL');

        return {
          type: 'postgres',
          url: databaseUrl, // ✅ Usa DATABASE_URL automaticamente
          autoLoadEntities: true,
          synchronize: false, // ⚠️ Sempre false em produção! Use migrations.
          logging: true, // ✅ Mostra queries no console (bom para desenvolvimento)
          ssl: databaseUrl.includes('railway') // ✅ Habilita SSL apenas para Railway
            ? { rejectUnauthorized: false }
            : false,
        };
      },
    }),
    AuthModule,
    UsersModule,
    RolesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
