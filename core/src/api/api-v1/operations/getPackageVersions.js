import { PackageVersion } from "../../../database.js";
import logger from "../../../logger.js";

export default async (c, req, res) => {
    const packageVersions = await PackageVersion.query()
        .where("packageID", c.request.params.packageID)
        .select(
            "id",
            "packageID",
            "version",
            "digest",
            "created_at",
            "updated_at"
        );

    logger.debug(
        `Found PackageVersions: ${JSON.stringify(
            packageVersions
        )}\nFor Package: ${c.request.params.packageID}`
    );

    res.status(200).json(packageVersions);
};
