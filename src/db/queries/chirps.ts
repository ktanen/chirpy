import { db } from "../index.js";
import { NewChirp, chirps } from "../schema.js";
import { asc, eq } from "drizzle-orm";

export async function insertChirp(chirp: NewChirp) {
    const [result] = await db
    .insert(chirps)
    .values(chirp)
    .returning();
  return result;
}

export async function getAllChirps() {
    const result = await db
    .select()
    .from(chirps)
    .orderBy(asc(chirps.createdAt));
    
    return result;
}

export async function deleteAllChirps() {
    await db.delete(chirps);
}

export async function getChirp(chirpID: string) {
    const [result] = await db
    .select()
    .from(chirps)
    .where(eq(chirps.id, chirpID));
    return result;
}

export async function deleteChirp(chirpID: string) {
    await db
    .delete(chirps)
    .where(eq(chirps.id, chirpID));
}