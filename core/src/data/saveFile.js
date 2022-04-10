import { outputFile } from "fs-extra";
import { error } from "../logger";

export default async (filePath, file) => {
    try {
        await outputFile(filePath, file);

        return;
    } catch (err) {
        error({ err: err }, `Could Not Save File: ${filePath}`);

        throw err;
    }
};
