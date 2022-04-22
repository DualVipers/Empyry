import { join } from "path";

import readFile from "../readFile.js";
import paths from "../../paths.js";

import logger from "../../logger.js";

/**
 * Loads a Package Version
 *
 * @param {string} name - The name of the Package
 * @param {string} version - The SemVer version of the Package
 *
 * @returns {Promise<Buffer>} The buffer of the Package Version
 */
export default async (name, version) => {
    const fileName = `${name}-${version}.tar.gz`;

    const filePath = join(paths.data, "Packages", fileName);

    try {
        return await readFile(filePath);
    } catch (err) {
        logger.error({ err: err }, `Could Not Load v${version} of ${name}`);

        throw err;
    }
};
