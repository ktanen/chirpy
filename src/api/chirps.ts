import {Request, Response} from "express"
import { respondWithJSON, respondWithError } from "./json.js"
type parameters = {
    body: string;
};

export async function handlerChirpsValidate(req: Request, res: Response) {
    let body = "";


    let params: parameters;
    req.on("data", (chunk) => {
        body += chunk;
    });

    req.on("end", () => {
        try {
            params = JSON.parse(body);

            const chirpLength: number = params.body.length;
            
            if (chirpLength > 140) {
                respondWithError(res, 400, "Chirp is too long");
            } else {
                const validPayload = {"valid": true};

                respondWithJSON(res, 200, validPayload);
            }
            
            
        } catch (error) {
            respondWithError(res, 400, "Invalid JSON");
        }

    });

}