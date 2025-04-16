import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config(); // 🚀 Carrega as variáveis de ambiente do .env

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL, // ✅ Usa a URL completa do Railway
  ssl: false,
  entities: ['dist/**/*.entity.js'], // Aponta para os arquivos compilados
  migrations: ['dist/typeorm/migrations/*.js'], // Caminho correto das migrations
  synchronize: true, // ⚠️ Nunca use "true" em produção
  logging: true, // Ativa logs do banco
});

AppDataSource.initialize()
  .then(() => console.log('📌 Banco de Dados Conectado com Sucesso! 🚀'))
  .catch((err) => {
    console.error('❌ Erro ao conectar ao banco:', err.message);
    process.exit(1);
  });
