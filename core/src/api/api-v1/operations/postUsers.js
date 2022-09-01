import { User } from "../../../database.js";
import logger from "../../../logger.js";

export default async (c, req, res) => {
    logger.debug(`Requested Add User ${c.request.body.name}`);

    const createdUser = await User.query()
        .insert({ password_hash: "123", ...c.request.body })
        .select("id", "username", "email", "created_at", "updated_at");

    logger.debug(`Added User: ${JSON.stringify(createdUser)}`);

    res.status(200).json(createdUser);
};
