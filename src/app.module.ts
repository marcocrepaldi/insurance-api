import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'

// ✅ Módulos funcionais
import { AuthModule } from './auth/auth.module'
import { UsersModule } from './users/users.module'
import { RolesModule } from './roles/roles.module'
import { ClientsModule } from './clients/clients.module'
import { ProducerModule } from './producers/producer.module'
import { InsurersModule } from './insurers/insurers.module'
import { TasksModule } from './tasks/tasks.module'
import { InsuranceQuoteModule } from './insurance-quote/insurance-quote.module'

// ✅ Núcleo da aplicação
import { AppController } from './app.controller'
import { AppService } from './app.service'

@Module({
  imports: [
    // 🌍 Carrega variáveis do .env como variáveis globais
    ConfigModule.forRoot({ isGlobal: true }),

    // 🛠️ Configuração assíncrona do TypeORM com PostgreSQL
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const databaseUrl = config.get<string>('DATABASE_URL') ?? ''
        const isUsingSSL = databaseUrl.includes('railway')

        return {
          type: 'postgres',
          url: databaseUrl,
          autoLoadEntities: true,
          synchronize: false, // 🚫 Nunca ative isso em produção real
          logging: true,
          ssl: isUsingSSL ? { rejectUnauthorized: false } : undefined,
        }
      },
    }),

    // 🚀 Módulos da aplicação
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
