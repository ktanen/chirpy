import { db } from "../index.js";
import { RefreshToken, refreshTokens, users } from "../schema.js";
import { config } from "../../config.js";
import { eq, gt, isNull, and } from "drizzle-orm";

export async function saveRefreshToken(userID: string, token: string) {
    const refreshToken: RefreshToken = {
        token: token,
        userId: userID,
        expiresAt: new Date(Date.now() + config.jwt.refreshDuration),
    };

    const [result] = await db
    .insert(refreshTokens)
    .values(refreshToken)
    .returning();
    return result;
}

export async function getUserFromRefreshToken(token: string) {
    const [result] = await db
    .select()
    .from(refreshTokens)
    .innerJoin(users, eq(users.id, refreshTokens.userId))
    .where(
        and(
            eq(refreshTokens.token, token),
            isNull(refreshTokens.revokedAt),
            gt(refreshTokens.expiresAt, new Date())
        )
    );

    return result;
    
}

export async function revokeRefreshToken(token: string) {
    const stamp = new Date();
    await db
    .update(refreshTokens)
    .set({revokedAt: stamp,
        updatedAt: stamp,
    })
    .where(eq(refreshTokens.token, token));
}