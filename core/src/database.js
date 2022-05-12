import Knex from "knex";
import { Model } from "objection";
import { join } from "path";

import logger from "./logger.js";
import paths from "./paths.js";

const knex = Knex({
    client: "better-sqlite3",
    useNullAsDefault: true,
    connection: {
        filename:
            process.env.NODE_ENV == "production"
                ? join(paths.data, "database.sqlite")
                : "database.sqlite",
    },
});

Model.knex(knex);

const pending = (await knex.migrate.list({ directory: "./src/migrations" }))[1];

logger.debug(`Number of pending migrations: ${pending.length}`);

if (pending.length > 0 && process.env.MIGRATION != "true") {
    logger.fatal(
        "The current database is not up to date.  Please run the migration before starting again."
    );
    process.exit(1);
}

export default knex;

export const runMigration = () =>
    knex.migrate.latest({ directory: "./src/migrations" });

export * from "./models/all.js";
