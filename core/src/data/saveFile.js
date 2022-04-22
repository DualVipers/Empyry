import { outputFile } from "fs-extra";

import logger from "../logger.js";

export default async (filePath, file) => {
    try {
        await outputFile(filePath, file);

        return;
    } catch (err) {
        logger.error({ err: err }, `Could Not Save File: ${filePath}`);

        throw err;
    }
};
