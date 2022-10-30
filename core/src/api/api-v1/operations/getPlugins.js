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

    res.status(200).json(
        plugins.map((plugin) => {
            return {
                id: plugin.id,
                name: plugin.name,
                type: plugin.type,
                location: plugin.location,
                version: plugin.version,
                created_at: plugin.created_at,
                updated_at: plugin.updated_at,
            };
        })
    );
};
