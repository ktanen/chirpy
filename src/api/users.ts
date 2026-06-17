import {Request, Response} from "express"
import { respondWithJSON, respondWithError } from "./json.js"
import { NewUser } from "../db/schema.js"
import { createUser } from "../db/queries/users.js"

export async function handlerCreateUser(req: Request, res: Response) {
    type parameters = {
        email: string;
    };

    const params: parameters = req.body;
    const email: string = params.email;

    const user: NewUser = {
        email: email
    };

    const fullUser = await createUser(user);

    respondWithJSON(res, 201, fullUser);

    
}