import { Role } from "../../../database.js";
import logger from "../../../logger.js";

export default async (c, req, res) => {
    logger.debug(
        `Requested Add Role\nFor Package:${c.request.params.package_id}\nFor User:${c.request.params.user_id}`
    );

    const createdRole = await Role.query()
        .insert({
            package_id: c.request.params.package_id,
            user_id: c.request.params.user_id,
        })
        .select("id", "package_id", "user_id", "created_at", "updated_at");

    logger.debug(
        `Added Role\nFor Package:${c.request.params.package_id}\nFor User:${c.request.params.user_id}`
    );

    res.status(200).json({
        id: createdRole.id,
        package_id: createdRole.package_id,
        user_id: createdRole.user_id,
        created_at: createdRole.created_at,
        updated_at: createdRole.updated_at,
    });
};
