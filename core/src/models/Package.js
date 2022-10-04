import { Model } from "objection";

import Base from "./Base.js";

import PackageVersion from "./PackageVersion.js";
import Role from "./Role.js";

class Package extends Base {
    constructor() {
        super();
    }

    static get tableName() {
        return "Packages";
    }

    static get relationMappings() {
        return {
            roles: {
                relation: Model.HasManyRelation,
                modelClass: Role,
                join: {
                    from: "Packages.id",
                    to: "Roles.package_id",
                },
            },
            versions: {
                relation: Model.HasManyRelation,
                modelClass: PackageVersion,
                join: {
                    from: "Packages.id",
                    to: "PackageVersions.package_id",
                },
            },
        };
    }
}

export default Package;
