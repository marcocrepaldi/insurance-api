import "reflect-metadata";
import { DataSource } from "typeorm";
import * as dotenv from "dotenv";
import path from "path";

dotenv.config(); // Garante que as variáveis de ambiente sejam carregadas

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432, // Garante um valor padrão seguro
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [path.join(__dirname, "../**/*.entity{.ts,.js}")], // Caminho seguro para evitar erros
  migrations: [path.join(__dirname, "../migrations/*{.ts,.js}")], // Define onde as migrations serão salvas
  synchronize: false, // Nunca ativar em produção! Usar migrations para atualizar o banco
  logging: true, // Para visualizar queries no console, útil no desenvolvimento
});

AppDataSource.initialize()
  .then(() => console.log("📌 Banco de Dados Conectado com Sucesso! 🚀"))
  .catch((err) => {
    console.error("❌ Erro ao conectar ao banco:", err.message);
    process.exit(1); // Força a saída da aplicação em caso de falha crítica
  });

export default AppDataSource;
