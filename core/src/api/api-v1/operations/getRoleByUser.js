import { Package } from "../../../database.js";
import logger from "../../../logger.js";

export default async (c, req, res) => {
    const role = await Package.relatedQuery("roles")
        .for(c.request.params.package_id)
        .where("user_id", c.request.params.user_id)
        .first() // There will only be one, but no unique support for Objection.js
        .select("id", "package_id", "user_id", "created_at", "updated_at");

    logger.debug(
        `Found Role: ${JSON.stringify(role)}\nFor Package: ${
            c.request.params.package_id
        }\nFor User: ${c.request.params.user_id}`
    );

    if (role) {
        return res.status(200).json(role);
    }

    res.status(404).json({ err: "user role not found" });
};
