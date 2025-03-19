import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Define um prefixo global para todas as rotas da API
  app.setGlobalPrefix("api");

  // Habilita CORS para permitir acessos externos
  app.enableCors();

  // Configuração do Swagger com ajuste para prefixo "api"
  const config = new DocumentBuilder()
    .setTitle("Insurance API")
    .setDescription("Documentação da API de Seguros")
    .setVersion("1.0")
    .addBearerAuth() // Suporte para autenticação JWT
    .setBasePath("api") // Garante que todas as rotas no Swagger apareçam corretamente
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, document);

  await app.listen(3000);

  console.log(`🚀 API rodando em http://localhost:3000/api`);
  console.log(`📄 Swagger disponível em http://localhost:3000/api/docs`);
}

bootstrap();
