import "reflect-metadata";
import { DataSource } from "typeorm";
import * as dotenv from "dotenv";
import path from "path";

dotenv.config(); // Carrega variáveis de ambiente

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [path.join(__dirname, "../**/*.entity{.ts,.js}")], // ✅ Correção para CommonJS
  migrations: [path.join(__dirname, "./migrations/*{.ts,.js}")], // ✅ Correção para CommonJS
  synchronize: false,
  logging: true,
});

AppDataSource.initialize()
  .then(() => console.log("📌 Banco de Dados Conectado com Sucesso! 🚀"))
  .catch((err) => {
    console.error("❌ Erro ao conectar ao banco:", err.message);
    process.exit(1);
  });

export default AppDataSource;
