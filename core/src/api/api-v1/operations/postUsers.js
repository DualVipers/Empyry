import { User } from "../../../database.js";
import logger from "../../../logger.js";
import { hash } from "../../../password.js";

export default async (c, req, res) => {
    logger.debug(`Requested Add User ${c.request.body.username}`);

    const password_hash = c.request.body.password
        ? await hash(c.request.body.password)
        : "123";

    c.request.body.password = undefined;

    const createdUser = await User.query()
        .insert({ password_hash: password_hash, ...c.request.body })
        .select("id", "username", "email", "created_at", "updated_at");

    logger.debug(`Added User: ${JSON.stringify(createdUser)}`);

    res.status(200).json({
        id: createdUser.id,
        username: createdUser.username,
        email: createdUser.email,
        created_at: createdUser.created_at,
        updated_at: createdUser.updated_at,
    });
};
