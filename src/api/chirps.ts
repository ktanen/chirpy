import {Request, Response} from "express"
import { respondWithJSON } from "./json.js"
import { BadRequestError } from "./errorHandling.js";
import { insertChirp } from "../db/queries/chirps.js";

export async function handlerCreateChirp(req: Request, res: Response) {

    type parameters = {
        body: string;
        userId: string;
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

        const cleanedPayload = {
            "body": cleanedBody,
            "userId": params.userId,
        };

        const chirp = await insertChirp(cleanedPayload);

        respondWithJSON(res, 201, chirp);

       
        


    }



}