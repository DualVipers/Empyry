import { Plugin } from "../../../database.js";
import logger from "../../../logger.js";

export default async (c, req, res) => {
    const foundPlugin = await Plugin.query()
        .findById(c.request.params.plugin_id)
        .select(
            "id",
            "name",
            "type",
            "location",
            "version",
            "created_at",
            "updated_at"
        );

    logger.debug(
        `Found Plugin: ${JSON.stringify(foundPlugin)}\nFor ID: ${
            c.request.params.plugin_id
        }`
    );

    if (foundPlugin) {
        return res.status(200).json({
            id: foundPlugin.id,
            name: foundPlugin.name,
            type: foundPlugin.type,
            location: foundPlugin.location,
            version: foundPlugin.version,
            created_at: foundPlugin.created_at,
            updated_at: foundPlugin.updated_at,
        });
    }

    res.status(404).json({ err: "plugin not found" });
};
