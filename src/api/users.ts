import {Request, Response} from "express"
import { respondWithJSON, respondWithError } from "./json.js"
import { NewUser, refreshTokens } from "../db/schema.js"
import { createUser, getUserByEmail } from "../db/queries/users.js"
import { hashPassword, checkPasswordHash, makeJWT } from "../auth.js"
import { config } from "../config.js"
import { makeRefreshToken } from "../auth.js"
import { saveRefreshToken } from "../db/queries/refresh.js"

export async function handlerCreateUser(req: Request, res: Response) {
    type parameters = {
        email: string;
        password: string;
    };

    const params: parameters = req.body;
    
    const email: string = params.email;
    const password = params.password;
    const hashed = await hashPassword(password);

    const user: NewUser = {
        email: email,
        hashedPassword: hashed
    };

    const fullUser = await createUser(user);
    if (!fullUser) {
    respondWithError(res, 400, "could not create user");
    return;
    }

    const { hashedPassword, ...userResponse } = fullUser;

    respondWithJSON(res, 201, userResponse);

    
}

export async function handlerLoginUser(req: Request, res: Response) {
    type parameters = {
        password: string;
        email: string;
    }
    const params: parameters = req.body;
    
    const email: string = params.email;
    const password = params.password;






    try {
        const user = await getUserByEmail(email);
        const { hashedPassword, ...userResponse } = user;
        const passwordIsCorrect = await checkPasswordHash(password, hashedPassword);

        if (! passwordIsCorrect) {
            respondWithError(res, 401, "incorrect email or password");
            return;
        }

        const token = makeJWT(user.id, config.jwt.defaultDuration, config.api.secret);

        const refreshTokenString = makeRefreshToken()
        const refreshToken = await saveRefreshToken(user.id, refreshTokenString);

        const responseBody = {
            ...userResponse,
            token: token,
            refreshToken: refreshTokenString
        };
        

        respondWithJSON(res, 200, responseBody);
    } catch (error) {
        respondWithError(res, 401, "incorrect email or password");
    }



}