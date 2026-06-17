import type { MigrationConfig } from "drizzle-orm/migrator";

const migrationConfig: MigrationConfig = {
  migrationsFolder: "./src/db/migrations",
};


process.loadEnvFile();

type APIConfig = {
  fileserverHits: number;
  platform: string;
};

type DBConfig = {
  url: string;
  migrationConfig: MigrationConfig
};

type Config = {
  api: APIConfig;
  db: DBConfig;
};

function envOrThrow(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`The ${key} environment variable is missing`);
  }
  return value;
}

const api: APIConfig = {
  fileserverHits: 0,
  platform: envOrThrow("PLATFORM"),
};

const db: DBConfig = {
  url: envOrThrow("DB_URL"),
  migrationConfig: migrationConfig,
}



const config: Config = {
  api: api,
  db: db,
};

export {config};
