import readFile from "../readFile";
import hashFile from "../hashFile";

/**
 * Creates a hash for the specified Package Version
 *
 * @param {string} name - The name of the Package
 * @param {Object} version - The version of the Package
 * @param {number} version.major - The Major integer for the Package Version
 * @param {number} version.minor - The Minor integer for the Package Version
 * @param {number} version.patch - The Patch integer for the Package Version
 *
 * @returns {Promise<string>} The hash of the Package
 */
export default async (name, version) => {
    try {
        const file = readFile(name, version);

        return await hashFile(file);
    } catch (err) {
        console.log(
            `Could Not Hash v${version.major}.${version.minor}.${version.patch} of ${name}`
        );

        throw err;
    }
};
