import { Model } from "objection";

import Base from "./Base.js";

import User from "./User.js";

class Token extends Base {
    constructor() {
        super();
    }

    static get tableName() {
        return "Tokens";
    }

    static get relationMappings() {
        return {
            user: {
                relation: Model.BelongsToOneRelation,
                modelClass: User,
                join: {
                    from: "Tokens.user_id",
                    to: "Users.id",
                },
            },
        };
    }
}

export default Token;
