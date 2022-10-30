import { Package } from "../../../database.js";
import logger from "../../../logger.js";

export default async (c, req, res) => {
    const packageVersions = await Package.relatedQuery("versions")
        .for(c.request.params.package_id)
        .select(
            "id",
            "package_id",
            "version",
            "digest",
            "created_at",
            "updated_at"
        );

    logger.debug(
        `Found PackageVersions: ${JSON.stringify(
            packageVersions
        )}\nFor Package: ${c.request.params.package_id}`
    );

    res.status(200).json(
        packageVersions.map((packageVersion) => {
            return {
                id: packageVersion.id,
                package_id: packageVersion.package_id,
                version: packageVersion.version,
                digest: packageVersion.digest,
                created_at: packageVersion.updated_at,
                updated_at: packageVersion.created_at,
            };
        })
    );
};
