import { User } from "../../../database.js";
import logger from "../../../logger.js";

export default async (c, req, res) => {
    const users = await User.query().select(
        "id",
        "username",
        "email",
        "created_at",
        "updated_at"
    );

    logger.debug(`Found Users: ${JSON.stringify(users)}`);

    res.status(200).json(users);
};
