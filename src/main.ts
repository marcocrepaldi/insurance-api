
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Insurance API')
    .setDescription('Documentação da API de Seguros')
    .setVersion('1.0')
    .addBearerAuth()
    .setBasePath('api')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(3000);

  console.log(`🚀 API rodando em http://localhost:3000/api`);
  console.log(`📄 Swagger disponível em http://localhost:3000/api/docs`);
}

bootstrap();
