import {Request, Response} from "express"
import { upgradeUser, getUserByID } from "../db/queries/users.js"
import { respondWithJSON, respondWithError } from "./json.js"
import { NotFoundError } from "./errorHandling.js";

export async function handlerPolkaWebhook(req: Request, res: Response) {
    type WebhookRequestParams = {
        event: string;
        data: {
            userId: string;
        };
    };

    const params: WebhookRequestParams = req.body;

    const event = params.event;

    if (event !== "user.upgraded") {
        res.status(204).send();
        return;
    } else {
      const userID = params.data.userId;

      const userToUpgrade = await getUserByID(userID);
        if (!userToUpgrade) {
            throw new NotFoundError("User not found");
        }

        await upgradeUser(userID);

        res.status(204).send();
    }

}