import type { MigrationConfig } from "drizzle-orm/migrator";

const migrationConfig: MigrationConfig = {
  migrationsFolder: "./src/db/migrations",
};


process.loadEnvFile();

type APIConfig = {
  fileserverHits: number;
  platform: string;
  secret: string;
};

type DBConfig = {
  url: string;
  migrationConfig: MigrationConfig
};
type JWTConfig = {
  defaultDuration: number;
  refreshDuration: number;
};

type Config = {
  api: APIConfig;
  db: DBConfig;
  jwt: JWTConfig
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
  secret: envOrThrow("JWT_SECRET"),
};

const db: DBConfig = {
  url: envOrThrow("DB_URL"),
  migrationConfig: migrationConfig,
}
const oneHour = 60 * 60 * 1000;
const sixtyDays = 60 * 24 * 60 * 60 * 1000;

const jwt: JWTConfig = {
  defaultDuration: oneHour,
  refreshDuration: sixtyDays,
}


const config: Config = {
  api: api,
  db: db,
  jwt: jwt,
};

export {config};
