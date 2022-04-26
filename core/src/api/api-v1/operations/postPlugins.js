import { Plugin } from "../../../database.js";
import logger from "../../../logger.js";

export default async (c, req, res) => {
    logger.debug(`Requested Add Plugin ${c.request.body.name}`);

    const createdPlugin = await Plugin.query()
        .insert({ ...c.request.body })
        .select(
            "id",
            "name",
            "type",
            "location",
            "version",
            "created_at",
            "updated_at"
        );

    logger.debug(`Added Plugin: ${JSON.stringify(createdPlugin)}`);

    res.status(200).json(createdPlugin);
};
