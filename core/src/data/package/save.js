import { join } from "path";

import saveFile from "../saveFile";
import { data } from "../paths";

/**
 * Creates a buffer as the specified Package Version
 * This does not create the SQL entry!
 *
 * @param {Buffer} file - The .tar.gz file to save
 * @param {string} name - The name of the Package
 * @param {Object} version - The SemVer version of the Package
 * @param {number} version.major - The Major integer for the Package Version
 * @param {number} version.minor - The Minor integer for the Package Version
 * @param {number} version.patch - The Patch integer for the Package Version
 *
 * @returns {Promise<null>}
 */
export default async (file, name, version) => {
    const fileName = `${name}-${version.major}.${version.minor}.${version.patch}.tar.gz`;

    const filePath = join(data, "Packages", fileName);

    try {
        await saveFile(filePath, file);
    } catch (err) {
        console.log(
            `Could Not Save v${version.major}.${version.minor}.${version.patch} of ${name}`
        );

        throw err;
    }
};
