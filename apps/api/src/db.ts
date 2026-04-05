import { createPool, type Pool } from "mysql2/promise";
import { loadEnv } from "./env";

let pool: Pool | null = null;

export function getPool(): Pool {
  if (pool) return pool;
  const env = loadEnv();
  pool = createPool({
    host: env.mysql.host,
    port: env.mysql.port,
    user: env.mysql.user,
    password: env.mysql.password,
    database: env.mysql.database,
    connectionLimit: 10,
    charset: "utf8mb4"
  });
  return pool;
}

export async function pingDb() {
  const p = getPool();
  await p.query("SELECT 1");
}

