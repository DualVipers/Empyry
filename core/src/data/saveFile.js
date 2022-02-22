import { outputFile } from "fs-extra";

export default async (filePath, file) => {
    try {
        await outputFile(filePath, file);

        return;
    } catch (err) {
        console.log("Could Not Save File: " + filePath);

        throw err;
    }
};
