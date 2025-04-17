import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { ValidationPipe } from '@nestjs/common'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // Definição do prefixo global da API
  app.setGlobalPrefix('api')

  // ✅ CORS permitido apenas para o domínio oficial
  app.enableCors({
    origin: ['https://www.harpersystem.com.br'],
    credentials: true,
  })

  // Pipe global de validação com transformação automática
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
    }),
  )

  // Swagger (Documentação da API)
  const config = new DocumentBuilder()
    .setTitle('Insurance API')
    .setDescription('Documentação da API de Seguros')
    .setVersion('1.0')
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api/docs', app, document)

  // Porta da aplicação (usa variável de ambiente ou padrão 3000)
  const port = parseInt(process.env.PORT || '3000', 10)
  const isDev = process.env.NODE_ENV !== 'production'

  await app.listen(port, '0.0.0.0')

  // Logs informativos
  console.log(`🚀 API rodando em http://localhost:${port}/api`)
  console.log(`📄 Swagger disponível em http://localhost:${port}/api/docs`)
  console.log(`🌱 Ambiente: ${process.env.NODE_ENV || 'desenvolvimento'}`)

  if (isDev) {
    console.log(`🛠️ Modo desenvolvimento ativado — logs estendidos`)
  }
}

bootstrap()
