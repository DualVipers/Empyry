import load from "./load.js";
import hashFile from "../hashFile.js";
import logger from "../../logger.js";

/**
 * Creates a hash for the specified Package Version
 *
 * @param {string} name - The name of the Package
 * @param {Object} version - The SemVer version of the Package
 *
 * @returns {Promise<string>} The hash of the Package
 */
export default async (name, version) => {
    try {
        const file = await load(name, version);

        return await hashFile(file);
    } catch (err) {
        logger.error({ err: err }, `Could Not Hash v${version} of ${name}`);

        throw err;
    }
};
