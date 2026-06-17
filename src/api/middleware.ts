import {Request, Response, NextFunction } from "express"
import { config } from "../config.js";
import { ForbiddenError } from "./errorHandling.js";
import { deleteAllUsers } from "../db/queries/users.js";

export function middlewareLogResponses(req: Request, res: Response, next: NextFunction) {
    res.on("finish", () => {
        const statusCode = res.statusCode;

        if (statusCode < 200 || statusCode >= 300) {
            console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${statusCode}`);
        }        
    });

    next();

}

export function middlewareMetricsInc(req: Request, res: Response, next: NextFunction) {
  config.api.fileserverHits += 1;
  next();
}

export function middlewareMetricsWrite(req: Request, res: Response, next: NextFunction) {
    res.set("Content-Type", "text/html; charset=utf-8");
    res.send(`<html>
  <body>
    <h1>Welcome, Chirpy Admin</h1>
    <p>Chirpy has been visited ${config.api.fileserverHits} times!</p>
  </body>
</html>`);
}

export async function middlewareMetricsReset(req: Request, res: Response, next: NextFunction) {
  if (config.api.platform !== "dev") {
    throw new ForbiddenError("Reset is only allowed in dev environment")
  }

    config.api.fileserverHits = 0;
    await deleteAllUsers();
    res.status(200).send("Hits reset to 0");
}