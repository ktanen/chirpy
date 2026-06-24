import express from "express";
import { handlerReadiness } from "./api/readiness.js";
import { middlewareLogResponses, middlewareMetricsInc,
  middlewareMetricsWrite, middlewareMetricsReset
 } from "./api/middleware.js";
import { handlerCreateChirp, handlerGetChirp, handlerDeleteChirp } from "./api/chirps.js";
import { errorHandler } from "./api/errorHandling.js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { config } from "./config.js";
import { handlerCreateUser, handlerLoginUser, handlerUpdateUser } from "./api/users.js";
import { handlerGetAllChirps } from "./api/chirps.js";
import { handlerRefresh, handlerRevoke } from "./api/refresh.js";
import { handlerPolkaWebhook } from "./api/polkaWebhooks.js";

const migrationClient = postgres(config.db.url, { max: 1 });
await migrate(drizzle(migrationClient), config.db.migrationConfig);

const app = express();
const PORT = 8080;
app.use(express.json());
app.use("/app", middlewareMetricsInc);
app.use("/admin/metrics", middlewareMetricsWrite);
app.post("/admin/reset", middlewareMetricsReset );

app.use("/app", express.static("./src/app"));

app.use(middlewareLogResponses);

app.get("/api/healthz", handlerReadiness);

app.post("/api/chirps", (req, res, next) => {
  Promise.resolve(handlerCreateChirp(req, res)).catch(next);
});

app.post("/api/users", (req, res, next) => {
  Promise.resolve(handlerCreateUser(req, res).catch(next));
});

app.put("/api/users", (req, res, next) => {
  Promise.resolve(handlerUpdateUser(req,res).catch(next));
});

app.post("/api/login", (req, res, next) => {
  Promise.resolve(handlerLoginUser(req, res).catch(next));
});

app.post("/api/refresh", (req, res, next) => {
  Promise.resolve(handlerRefresh(req, res).catch(next));
});

app.post("/api/revoke", (req, res, next) => {
  Promise.resolve(handlerRevoke(req, res).catch(next));
});

app.get("/api/chirps", (req, res, next) => {
  Promise.resolve(handlerGetAllChirps(req,res)).catch(next);
});
app.get("/api/chirps/:chirpId", (req, res, next) => {
  Promise.resolve(handlerGetChirp(req, res)).catch(next);
});

app.delete("/api/chirps/:chirpId", (req, res, next) => {
  Promise.resolve(handlerDeleteChirp(req, res).catch(next));
});

app.post("/api/polka/webhooks", (req, res, next) => {
  Promise.resolve(handlerPolkaWebhook(req, res).catch(next));
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

