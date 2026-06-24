import {Request, Response} from "express"
import { respondWithJSON } from "./json.js"
import { BadRequestError, NotFoundError, ForbiddenError } from "./errorHandling.js";
import { insertChirp, getAllChirps, getChirp, deleteChirp } from "../db/queries/chirps.js";
import { getBearerToken, validateJWT } from "../auth.js";
import { config } from "../config.js";
import { NewChirp } from "../db/schema.js";
import { a } from "vitest/dist/chunks/suite.d.FvehnV49.js";
export async function handlerCreateChirp(req: Request, res: Response) {

    type parameters = {
        body: string;
    };



    const params: parameters = req.body;
    
    const chirpLength: number = params.body.length;
    
    if (chirpLength > 140) {
        throw new BadRequestError("Chirp is too long. Max length is 140");
    } else {
        const bannedWords: string[] = ["kerfuffle", "sharbert", "fornax"];

        const words = params.body.split(" ");

        for (let i = 0; i < words.length; i++) {
            if (bannedWords.includes(words[i].toLowerCase())) {
                words[i] = "****";
            }
        }

        const cleanedBody = words.join(" ");

        const token = getBearerToken(req);
        const userID = validateJWT(token, config.api.secret);

        const cleanedPayload = {
            "body": cleanedBody,
            "userId": userID,
        };

        const chirp = await insertChirp(cleanedPayload);

        respondWithJSON(res, 201, chirp);

       
        


    }
}

export async function handlerGetAllChirps(req: Request, res: Response) {
    let authorId = undefined;
    let sort = "asc";
    let authorIdQuery = req.query.authorId;
    let sortQuery = req.query.sort;

    if (typeof authorIdQuery === "string") {
    authorId = authorIdQuery;
    }
    if (sortQuery === "desc") {
        sort = "desc";
    }

    const chirps = await getAllChirps(authorId);
    if (sort === "desc") {
        chirps.sort((a, b)=>b.createdAt?.getTime()- a.createdAt?.getTime());
    }

    respondWithJSON(res, 200, chirps);
}

export async function handlerGetChirp(req: Request, res: Response) {
   const { chirpId } = req.params;

   if (typeof chirpId !== "string") {
    throw new BadRequestError("ID must be a string");
   }

   const chirp = await getChirp(chirpId);
   
   if (!chirp) {
    throw new NotFoundError("Chirp not found");
   }

   respondWithJSON(res, 200, chirp);

}

export async function handlerDeleteChirp(req: Request, res: Response) {
    const { chirpId } = req.params;
   if (typeof chirpId !== "string") {
    throw new BadRequestError("ID must be a string");
   }

   const chirpToDelete = await getChirp(chirpId);
   
   if (!chirpToDelete) {
    throw new NotFoundError("Chirp not found");
   }
    const token = getBearerToken(req);
    const userID = validateJWT(token, config.api.secret);

    const chirpUserID = chirpToDelete.userId;

    if (chirpUserID !== userID) {
        throw new ForbiddenError("You are not the author of this chirp");
    }

    await deleteChirp(chirpId)

    res.status(204).send();





}