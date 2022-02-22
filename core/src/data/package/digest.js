import readFile from "../readFile";
import hashFile from "../hashFile";

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
