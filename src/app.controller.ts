import { Controller, Get } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { AppService } from "./app.service";

@ApiTags("Root") // Define a categoria no Swagger
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ summary: "Retorna uma mensagem de boas-vindas" })
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @ApiOperation({ summary: "Verifica o status da API" })
  @Get("health")
  healthCheck(): string {
    return "API is running!";
  }
}
