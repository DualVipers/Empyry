import { User } from "../../../database.js";
import logger from "../../../logger.js";
import { hash } from "../../../password.js";

export default async (c, req, res) => {
    logger.debug(`Requested Update User Password ${c.request.body.username}`);

    if (c.request.params.user_id != req.user) {
        res.status(401).json();
    }

    const password_hash = c.request.body.password
        ? await hash(c.request.body.password)
        : "123";

    const updatedUser = await User.query()
        .patch({ password_hash })
        .findById(req.user)
        .select("id", "username");

    logger.debug(`Updated password for User: ${JSON.stringify(updatedUser)}`);

    res.status(200).json();
};
