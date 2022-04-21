import { Model } from "objection";

import knex from "../database.js";

class BaseModel extends Model {
    $beforeUpdate() {
        this.updated_at = knex.fn.now();
    }
}

export default BaseModel;
