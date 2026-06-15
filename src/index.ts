import express from "express";
import { handlerReadiness } from "./api/readiness.js";
import { middlewareLogResponses, middlewareMetricsInc,
  middlewareMetricsWrite, middlewareMetricsReset
 } from "./api/middleware.js";
 import { handlerChirpsValidate } from "./api/chirps.js";
import { allowedNodeEnvironmentFlags } from "node:process";

const app = express();
const PORT = 8080;

app.use("/app", middlewareMetricsInc);
app.use("/admin/metrics", middlewareMetricsWrite);
app.post("/admin/reset", middlewareMetricsReset );
app.use("/app", express.static("./src/app"));

app.use(middlewareLogResponses);

app.get("/api/healthz", handlerReadiness);
app.post("/api/validate_chirp", handlerChirpsValidate);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

