import { Model } from "objection";

import PackageVersion from "./PackageVersion.js";
import Base from "./Base.js";

class Package extends Base {
    constructor() {
        super();
    }

    static get tableName() {
        return "Packages";
    }

    static get relationMappings() {
        return {
            versions: {
                relation: Model.HasManyRelation,
                modelClass: PackageVersion,
                join: {
                    from: "Packages.id",
                    to: "PackageVersions.packageID",
                },
            },
        };
    }
}

export default Package;
