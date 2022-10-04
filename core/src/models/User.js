import { Model } from "objection";

import Base from "./Base.js";

import Role from "./Role.js";

class User extends Base {
    constructor() {
        super();
    }

    static get tableName() {
        return "Users";
    }

    static get relationMappings() {
        return {
            roles: {
                relation: Model.HasManyRelation,
                modelClass: Role,
                join: {
                    from: "Users.id",
                    to: "Roles.user_id",
                },
            },
        };
    }
}

export default User;
