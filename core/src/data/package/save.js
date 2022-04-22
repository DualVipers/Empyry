import { join } from "path";

import saveFile from "../saveFile.js";
import paths from "../../paths.js";

import logger from "../../logger.js";

/**
 * Creates a buffer as the specified Package Version
 * This does not create the SQL entry!
 *
 * @param {Buffer} file - The .tar.gz file to save
 * @param {string} name - The name of the Package
 * @param {Object} version - The SemVer version of the Package
 *
 * @returns {Promise<null>}
 */
export default async (file, name, version) => {
    const fileName = `${name}-${version}.tar.gz`;

    const filePath = join(paths.data, "Packages", fileName);

    try {
        await saveFile(filePath, file);
    } catch (err) {
        logger.error({ err: err }, `Could Not Save v${version} of ${name}`);

        throw err;
    }
};
