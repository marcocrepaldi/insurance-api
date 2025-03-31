import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'

// Módulos internos
import { AuthModule } from './auth/auth.module'
import { UsersModule } from './users/users.module'
import { RolesModule } from './roles/roles.module'
import { ClientsModule } from './clients/clients.module'
import { ProducerModule } from './producers/producer.module'
import { InsurersModule } from './insurers/insurers.module'
import { TasksModule } from './tasks/tasks.module'
import { InsuranceQuoteModule } from './insurance-quote/insurance-quote.module'

// Root
import { AppController } from './app.controller'
import { AppService } from './app.service'

@Module({
  imports: [
    // ✅ Carrega variáveis do .env automaticamente
    ConfigModule.forRoot({ isGlobal: true }),

    // ✅ Configuração assíncrona do TypeORM
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const databaseUrl = configService.get<string>('DATABASE_URL')
        const isRailway = databaseUrl?.includes('railway')

        return {
          type: 'postgres',
          url: databaseUrl,
          autoLoadEntities: true,
          synchronize: false, // ⚠️ Use migrations em produção
          logging: true,
          ssl: isRailway
            ? { rejectUnauthorized: false }
            : false,
        }
      },
    }),

    // ✅ Importação de todos os módulos funcionais
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
