import { generateString } from "./utils.js";
import { Token } from "./database.js";
import logger from "./logger.js";

export const cleanup = () => {
    const number = Token.query()
        .delete()
        .where("expire", "<", Date.now() / 1000);

    logger.info(`Deleted ${number} of expired Tokens.`);
};

export const generate = (length) => {
    const token = generateString(length);

    return token;
};

/**
 * Returns the user_id of the token, or null if no token exists (or is expired)
 */
export const verify = async (token) => {
    const tokenObj = await Token.query()
        .findOne("token", token)
        .select("id", "user_id", "expire");

    if (!tokenObj) {
        return null;
    }

    if (tokenObj.expire > Date.now() / 1000) {
        return null;
    }

    return tokenObj.user_id;
};
