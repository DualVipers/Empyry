import { Model } from "objection";

import Base from "./Base.js";
import Package from "./Package.js";

import knex from "../database.js";

class PackageVersion extends Base {
    constructor() {
        super();
    }

    static get tableName() {
        return "PackageVersions";
    }

    static get relationMappings() {
        const Package = import("./Package.js");

        return {
            package: {
                relation: Model.BelongsToOneRelation,
                modelClass: Package,
                join: {
                    from: "PackageVersions.package_id",
                    to: "Packages.id",
                },
            },
        };
    }

    $beforeUpdate() {
        Package.query().findById(this.package_id).patch({
            updated_at: knex.fn.now(),
        });

        super.$beforeUpdate();
    }
}

export default PackageVersion;
