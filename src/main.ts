import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { ValidationPipe } from '@nestjs/common'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // ✅ Prefixo global para todas as rotas
  app.setGlobalPrefix('api')

  // ✅ Habilita CORS para ambientes autorizados
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://insurance-frontend-olive.vercel.app',
    ],
    credentials: true,
  })

  // ✅ Pipe global para validações dos DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )

  // ✅ Swagger config
  const config = new DocumentBuilder()
    .setTitle('Insurance API')
    .setDescription('Documentação da API de Seguros')
    .setVersion('1.0')
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api/docs', app, document)

  // ✅ Inicializa aplicação
  await app.listen(3000)

  console.log(`🚀 API rodando em http://localhost:3000/api`)
  console.log(`📄 Swagger disponível em http://localhost:3000/api/docs`)
}

bootstrap()
