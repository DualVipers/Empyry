import load from "./load";
import hashFile from "../hashFile";

import { error } from "../../logger";

/**
 * Creates a hash for the specified Package Version
 *
 * @param {string} name - The name of the Package
 * @param {Object} version - The SemVer version of the Package
 * @param {number} version.major - The Major integer for the Package Version
 * @param {number} version.minor - The Minor integer for the Package Version
 * @param {number} version.patch - The Patch integer for the Package Version
 *
 * @returns {Promise<string>} The hash of the Package
 */
export default async (name, version) => {
    try {
        const file = load(name, version);

        return await hashFile(file);
    } catch (err) {
        error(
            { err: err },
            `Could Not Hash v${version.major}.${version.minor}.${version.patch} of ${name}`
        );

        throw err;
    }
};
