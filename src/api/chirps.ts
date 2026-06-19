import {Request, Response} from "express"
import { respondWithJSON } from "./json.js"
import { BadRequestError, NotFoundError } from "./errorHandling.js";
import { insertChirp, getAllChirps, getChirp } from "../db/queries/chirps.js";
import { getBearerToken, validateJWT } from "../auth.js";
import { config } from "../config.js";
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
    const chirps = await getAllChirps();
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