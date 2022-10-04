import { Model } from "objection";

import Base from "./Base.js";

import Package from "./Package.js";
import User from "./User.js";

import knex from "../database.js";

class Role extends Base {
    constructor() {
        super();
    }

    static get tableName() {
        return "Roles";
    }

    static get relationMappings() {
        return {
            package: {
                relation: Model.BelongsToOneRelation,
                modelClass: Package,
                join: {
                    from: "Roles.package_id",
                    to: "Packages.id",
                },
            },
            user: {
                relation: Model.BelongsToOneRelation,
                modelClass: User,
                join: {
                    from: "Roles.user_id",
                    to: "Users.id",
                },
            },
        };
    }

    $beforeUpdate() {
        const Package = import("./Package.js");

        Package.query().findById(this.package_id).patch({
            updated_at: knex.fn.now(),
        });

        super.$beforeUpdate();
    }
}

export default Role;
