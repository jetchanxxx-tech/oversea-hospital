export type Env = {
  port: number;
  adminApiKey: string;
  mysql: {
    host: string;
    port: number;
    user: string;
    password: string;
    database: string;
  };
};

export function loadEnv(): Env {
  const port = Number(process.env.PORT ?? process.env.API_PORT ?? 3001);
  const adminApiKey = String(process.env.ADMIN_API_KEY ?? "change-me");

  const host = String(process.env.MYSQL_HOST ?? "127.0.0.1");
  const mysqlPort = Number(process.env.MYSQL_PORT ?? 3306);
  const user = String(process.env.MYSQL_USER ?? "oversea");
  const password = String(process.env.MYSQL_PASSWORD ?? "oversea");
  const database = String(process.env.API_DB_NAME ?? process.env.MYSQL_DATABASE ?? "oversea_api");

  return {
    port,
    adminApiKey,
    mysql: { host, port: mysqlPort, user, password, database }
  };
}

