import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // Prefixo global da API
  app.setGlobalPrefix('api')

  // Libera CORS para o frontend
  app.enableCors()

  // Configuração Swagger
  const config = new DocumentBuilder()
    .setTitle('Insurance API')
    .setDescription('Documentação da API de Seguros')
    .setVersion('1.0')
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api/docs', app, document)

  // Inicia o servidor
  await app.listen(3000)

  console.log(`🚀 API rodando em http://localhost:3000/api`)
  console.log(`📄 Swagger disponível em http://localhost:3000/api/docs`)
}

bootstrap()
