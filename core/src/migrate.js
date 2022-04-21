import { runMigration, default as knex } from "./database.js";

await runMigration();

await knex.destroy();
