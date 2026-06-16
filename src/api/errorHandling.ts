import {Request, Response, NextFunction } from "express"
import { respondWithError } from "./json.js";
export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
    let statusCode = 500;
    let message = "Something went wrong on our end";
    console.log(err.message);

    respondWithError(res, statusCode, message);
}