import Base from "./Base.js";

class Package extends Base {
    constructor() {
        super();
    }

    static get tableName() {
        return "Users";
    }
}

export default Package;
