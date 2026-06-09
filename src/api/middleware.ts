import {Request, Response, NextFunction } from "express"
import { config } from "../config.js";

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
  config.fileserverHits += 1;
  next();
}

export function middlewareMetricsWrite(req: Request, res: Response, next: NextFunction) {
    res.send(`Hits: ${config.fileserverHits}`);
}

export function middlewareMetricsReset(req: Request, res: Response, next: NextFunction) {
    config.fileserverHits = 0;
    res.send("done");
}