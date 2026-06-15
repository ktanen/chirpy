import {Request, Response} from "express"
import { respondWithJSON, respondWithError } from "./json.js"


export async function handlerChirpsValidate(req: Request, res: Response) {

    type parameters = {
        body: string;
    };



    const params: parameters = req.body;
    
    const chirpLength: number = params.body.length;
    
    if (chirpLength > 140) {
        respondWithError(res, 400, "Chirp is too long");
    } else {
        const validPayload = {"valid": true};

        respondWithJSON(res, 200, validPayload);
    }



}