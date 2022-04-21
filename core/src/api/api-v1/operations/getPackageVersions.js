import { Package } from "../../../database.js";
import logger from "../../../logger.js";

export default async (c, req, res) => {
    const packageVersions = await Package.relatedQuery("versions")
        .for(c.request.params.packageID)
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
