import { User } from "../../../database.js";
import logger from "../../../logger.js";

export default async (c, req, res) => {
    const foundUser = await User.query()
        .findById(c.request.params.user_id)
        .select("id", "username", "email", "created_at", "updated_at");

    logger.debug(
        `Found User: ${JSON.stringify(foundUser)}\nFor ID: ${
            c.request.params.user_id
        }`
    );

    if (foundUser) {
        return res.status(200).json(foundUser);
    }

    res.status(404).json({ err: "user not found" });
};
