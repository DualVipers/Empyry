import { PackageVersion } from "../../../database.js";
import logger from "../../../logger.js";

export default async (c, req, res) => {
    const packageVersion = await PackageVersion.query()
        .where("packageID", c.request.params.packageID)
        .where("version", c.request.params.version)
        .select(
            "id",
            "packageID",
            "version",
            "digest",
            "created_at",
            "updated_at"
        );

    logger.debug(
        `Found Package Version: ${JSON.stringify(
            packageVersion[0]
        )}\nFor Package: ${c.request.params.packageID}\nFor Version: ${
            c.request.params.version
        }`
    );

    if (packageVersion[0]) {
        return res.status(200).json(packageVersion[0]);
    }

    res.status(404).json({ err: "package version not found" });
};
