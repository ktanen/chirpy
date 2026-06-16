import {Request, Response} from "express"
import { respondWithJSON, respondWithError } from "./json.js"
import { BadRequestError } from "./errorHandling.js";


export async function handlerChirpsValidate(req: Request, res: Response) {

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

        const cleanedPayload = {
            "cleanedBody": cleanedBody
        };

        respondWithJSON(res, 200, cleanedPayload);
        


    }



}