import { readFile } from "fs-extra";
import { error } from "../logger";

export default async (filePath) => {
    try {
        return await readFile(filePath);
    } catch (err) {
        error({ err: err }, `Could Not Read File: ${filePath}`);

        throw err;
    }
};
