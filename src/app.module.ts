import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'

// ✅ Módulos de funcionalidades
import { AuthModule } from './auth/auth.module'
import { UsersModule } from './users/users.module'
import { RolesModule } from './roles/roles.module'
import { ClientsModule } from './clients/clients.module'
import { ProducerModule } from './producers/producer.module'
import { InsurersModule } from './insurers/insurers.module'
import { TasksModule } from './tasks/tasks.module'
import { InsuranceQuoteModule } from './insurance-quote/insurance-quote.module'

// ✅ Módulo raiz
import { AppController } from './app.controller'
import { AppService } from './app.service'

@Module({
  imports: [
    // ✅ Carrega variáveis de ambiente (.env) globalmente
    ConfigModule.forRoot({ isGlobal: true }),

    // ✅ Conexão com banco de dados PostgreSQL (Railway ou local)
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const databaseUrl = config.get<string>('DATABASE_URL')
        const isRailway = databaseUrl?.includes('railway')

        return {
          type: 'postgres',
          url: databaseUrl,
          autoLoadEntities: true,
          synchronize: false, // ⚠️ Nunca ativar em produção
          logging: true,
          ssl: isRailway ? { rejectUnauthorized: false } : false,
        }
      },
    }),

    // ✅ Módulos funcionais da aplicação
    AuthModule,
    UsersModule,
    RolesModule,
    ClientsModule,
    ProducerModule,
    InsurersModule,
    TasksModule,
    InsuranceQuoteModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
