import { readFile } from "fs-extra";

export default async (filePath) => {
    try {
        return await readFile(filePath);
    } catch (err) {
        console.log("Could Not Read File: " + filePath);

        throw err;
    }
};
