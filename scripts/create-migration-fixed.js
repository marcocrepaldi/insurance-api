const fs = require("fs");
const path = require("path");

const timestamp = Date.now();
const migrationNameArg = process.argv[2];

if (!migrationNameArg) {
  console.error("❌ Você precisa informar um nome para a migration.");
  process.exit(1);
}

const fileName = `${timestamp}-${migrationNameArg}.ts`;
const className = `${camelToPascal(migrationNameArg)}${timestamp}`;
const filePath = path.join("src", "typeorm", "migrations", fileName);

const template = `import { MigrationInterface, QueryRunner } from "typeorm";

export class ${className} implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // TODO: Adicione sua lógica aqui
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // TODO: Reversão da lógica aqui
  }
}
`;

fs.writeFileSync(filePath, template);
console.log(`✅ Migration criada: ${filePath}`);

function camelToPascal(str) {
  return str
    .split(/[-_]/)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");
}
