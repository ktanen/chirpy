
process.loadEnvFile();

type APIConfig = {
  fileserverHits: number;
  dbURL: string;
};

function envOrThrow(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`The ${key} environment variable is missing`);
  }
  return value;
}
  
const dbURL = envOrThrow("DB_URL");

const config: APIConfig = {
    fileserverHits: 0,
    dbURL: dbURL
};

export {config};
