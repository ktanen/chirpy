import {Request, Response} from "express"
import { respondWithJSON, respondWithError } from "./json.js"
import { getUserFromRefreshToken, revokeRefreshToken } from "../db/queries/refresh.js"
import { getBearerToken, makeJWT } from "../auth.js"
import { config } from "../config.js"

export async function handlerRefresh(req: Request, res: Response) {
    const refreshTokenString = getBearerToken(req);
    const refreshToken = await getUserFromRefreshToken(refreshTokenString);

    if (!refreshToken) {
        respondWithError(res, 401, "Invalid or missing refresh token");
    } else {
        const userId = refreshToken.users.id;
        const accessToken = makeJWT(userId, config.jwt.defaultDuration, config.api.secret);
        const responseBody = {
            token: accessToken,
        }
        respondWithJSON(res, 200, responseBody);
    }


}

export async function handlerRevoke(req: Request, res: Response) {
    const tokenString = getBearerToken(req);
    await revokeRefreshToken(tokenString);
    res.status(204).send();
}