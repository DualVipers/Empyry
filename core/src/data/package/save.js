import { join } from "path";

import saveFile from "../saveFile";
import { data } from "../paths";

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
