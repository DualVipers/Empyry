import { Model } from "objection";

import Base from "./Base.js";

import Role from "./Role.js";
import Token from "./Token.js";

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
            tokens: {
                relation: Model.HasManyRelation,
                modelClass: Token,
                join: {
                    from: "Users.id",
                    to: "Tokens.user_id",
                },
            },
        };
    }
}

export default User;
