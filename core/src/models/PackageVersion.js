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
                    from: "PackageVersions.packageID",
                    to: "Packages.id",
                },
            },
        };
    }

    $beforeUpdate() {
        Package.query().findById(this.packageID).patch({
            updated_at: knex.fn.now(),
        });

        this.version = this.major + "." + this.minor + "." + this.patch;

        if (this.preRelease) {
            this.version += "-" + this.preRelease;
        }

        if (this.build) {
            this.version += "+" + this.build;
        }

        super.$beforeUpdate();
    }
}

export default PackageVersion;
