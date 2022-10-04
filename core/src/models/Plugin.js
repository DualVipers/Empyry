import Base from "./Base.js";

class Plugin extends Base {
    constructor() {
        super();
    }

    static get tableName() {
        return "Plugins";
    }
}

export default Plugin;
