import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { loadEnv } from "./env";
import { getPool } from "./db";
import { schemaSql } from "./schema";

async function ensureSchema() {
  const sql = schemaSql;
  const pool = getPool();
  const statements = sql
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  for (const stmt of statements) {
    await pool.query(stmt);
  }
}

async function bootstrap() {
  const env = loadEnv();
  await ensureSchema();

  const app = await NestFactory.create(AppModule, { cors: true });
  await app.listen(env.port);
}

bootstrap();

