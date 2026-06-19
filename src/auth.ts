import * as argon2 from "argon2";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";


export async function hashPassword(password: string): Promise<string> {
    const hashedPassword = await argon2.hash(password);
    return hashedPassword;
}

export async function checkPasswordHash(password: string, hash: string): Promise<boolean> {
    const passwordMatched = await argon2.verify(hash, password);
    return passwordMatched;
}

export function makeJWT(userID: string, expiresIn: number, secret: string): string {
    type payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;
    const issuedAt = Math.floor(Date.now()/1000);
    const expirationTime = issuedAt + expiresIn;
    const load: payload = {
        iss: "chirpy",
        sub: userID,
        iat: issuedAt,
        exp: expirationTime,
    };

    const token = jwt.sign(load, secret);

    return token;

}

export function validateJWT(tokenString: string, secret: string): string {
    let decoded;
    try {
        decoded = jwt.verify(tokenString, secret);
        
    } catch (error) {
        throw new Error("invalid token");
    }
    if (typeof decoded === "string") {
    throw new Error("invalid token");
    }

    if (typeof decoded.sub !== "string") {
    throw new Error("invalid token");
    }

    return decoded.sub;

}