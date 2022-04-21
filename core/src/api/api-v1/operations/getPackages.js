import { Package } from "../../../database.js";
import logger from "../../../logger.js";

export default async (c, req, res) => {
    const packages = await Package.query().select(
        "id",
        "name",
        "description",
        "source",
        "home",
        "license",
        "created_at",
        "updated_at"
    );

    logger.debug(`Found Packages: ${JSON.stringify(packages)}`);

    res.status(200).json(packages);
};
