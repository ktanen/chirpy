import express from "express";
import { handlerReadiness } from "./api/readiness.js";
import { middlewareLogResponses, middlewareMetricsInc,
  middlewareMetricsWrite, middlewareMetricsReset
 } from "./api/middleware.js";
import { handlerChirpsValidate } from "./api/chirps.js";
import { errorHandler } from "./api/errorHandling.js";

const app = express();
const PORT = 8080;
app.use(express.json());
app.use("/app", middlewareMetricsInc);
app.use("/admin/metrics", middlewareMetricsWrite);
app.post("/admin/reset", middlewareMetricsReset );
app.use("/app", express.static("./src/app"));

app.use(middlewareLogResponses);

app.get("/api/healthz", handlerReadiness);

app.post("/api/validate_chirp", (req, res, next) => {
  Promise.resolve(handlerChirpsValidate(req, res)).catch(next);
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

