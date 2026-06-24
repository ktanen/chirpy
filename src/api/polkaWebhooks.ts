import {Request, Response} from "express"
import { upgradeUser, getUserByID } from "../db/queries/users.js"
import { respondWithJSON, respondWithError } from "./json.js"
import { NotFoundError, UnauthorizedError } from "./errorHandling.js";
import { config } from "../config.js";
import { getAPIKey } from "../auth.js";

export async function handlerPolkaWebhook(req: Request, res: Response) {
    type WebhookRequestParams = {
        event: string;
        data: {
            userId: string;
        };
    };

    //Check API Key

    const apiKey = getAPIKey(req);
    const polkaKey = config.api.apiKey;

    if (apiKey !== polkaKey) {
        throw new UnauthorizedError("Unauthorized");
    }

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