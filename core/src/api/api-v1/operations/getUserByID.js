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
        return res.status(200).json({
            id: foundUser.id,
            username: foundUser.username,
            email: foundUser.email,
            created_at: foundUser.created_at,
            updated_at: foundUser.updated_at,
        });
    }

    res.status(404).json({ err: "user not found" });
};
