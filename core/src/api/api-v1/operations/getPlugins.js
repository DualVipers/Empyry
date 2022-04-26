import { Plugin } from "../../../database.js";
import logger from "../../../logger.js";

export default async (c, req, res) => {
    const plugins = await Plugin.query().select(
        "id",
        "name",
        "type",
        "location",
        "version",
        "created_at",
        "updated_at"
    );

    logger.debug(`Found Plugins: ${JSON.stringify(plugins)}`);

    res.status(200).json(plugins);
};
