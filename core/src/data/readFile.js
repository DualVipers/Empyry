import fs from "fs-extra";

import logger from "../logger.js";

export default async (filePath) => {
    try {
        return await fs.readFile(filePath);
    } catch (err) {
        logger.error({ err: err }, `Could Not Read File: ${filePath}`);

        throw err;
    }
};
