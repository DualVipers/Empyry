import { join } from "path";

import readFile from "../readFile";
import { data } from "../paths";

import { error } from "../../logger";

/**
 * Loads a Package Version
 *
 * @param {string} name - The name of the Package
 * @param {Object} version - The SemVer version of the Package
 * @param {number} version.major - The Major integer for the Package Version
 * @param {number} version.minor - The Minor integer for the Package Version
 * @param {number} version.patch - The Patch integer for the Package Version
 *
 * @returns {Promise<Buffer>} The buffer of the Package Version
 */
export default async (name, version) => {
    const fileName = `${name}-${version.major}.${version.minor}.${version.patch}.tar.gz`;

    const filePath = join(data, "Packages", fileName);

    try {
        return await readFile(filePath);
    } catch (err) {
        error(
            { err: err },
            `Could Not Load v${version.major}.${version.minor}.${version.patch} of ${name}`
        );

        throw err;
    }
};
