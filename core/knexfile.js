import { join } from "path";

import paths from "./src/paths.js";

export default {
    client: "sqlite3",
    connection: {
        filename:
            process.env.NODE_ENV == "production"
                ? join(paths.data, "database.sqlite")
                : "database.sqlite",
    },
    migrations: { directory: "./src/migrations" },
};
