import { User } from "../../../database.js";
import logger from "../../../logger.js";
import { verify } from "../../../password.js";
import { generate } from "../../../token.js";

export default async (c, req, res) => {
    logger.debug(`Requested Token For User ${c.request.params.user_id}`);

    const foundUser = await User.query()
        .findById(c.request.params.user_id)
        .select("id", "username", "admin", "password_hash");

    logger.debug(
        `Found User: ${JSON.stringify(foundUser)}\nFor ID: ${
            c.request.params.user_id
        }`
    );

    if (!foundUser) {
        return res.status(401).json({
            err: "The User or supplied password is not good",
        });
    }

    if (!(await verify(foundUser.password_hash, c.request.body.password)))
        return res.status(401).json();

    const generatedToken = generate(20);

    const createdToken = await foundUser
        .$relatedQuery("tokens")
        .insert({
            token: generatedToken,
            admin: foundUser.admin,
            expire: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 1 day
        })
        .select("id");

    logger.debug(`Added Token: ${JSON.stringify(createdToken)}`);

    res.status(200).json({ token: generatedToken });
};
