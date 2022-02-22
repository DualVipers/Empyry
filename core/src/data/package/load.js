import { join } from "path";

import readFile from "../readFile";
import { data } from "../paths";

export default async (name, version) => {
    const fileName = `${name}-${version.major}.${version.minor}.${version.patch}.tar.gz`;

    const filePath = join(data, "Packages", fileName);

    try {
        return await readFile(filePath);
    } catch (err) {
        console.log(
            `Could Not Load v${version.major}.${version.minor}.${version.patch} of ${name}`
        );

        throw err;
    }
};
