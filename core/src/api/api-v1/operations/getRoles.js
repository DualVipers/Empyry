import { Package } from "../../../database.js";
import logger from "../../../logger.js";

export default async (c, req, res) => {
    const roles = await Package.relatedQuery("roles")
        .for(c.request.params.package_id)
        .select("id", "package_id", "user_id", "created_at", "updated_at");

    logger.debug(
        `Found Roles: ${JSON.stringify(roles)}\nFor Package: ${
            c.request.params.package_id
        }`
    );

    res.status(200).json(
        roles.map((role) => {
            return {
                id: role.id,
                package_id: role.package_id,
                user_id: role.user_id,
                created_at: role.created_at,
                updated_at: role.updated_at,
            };
        })
    );
};
