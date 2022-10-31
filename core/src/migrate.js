import { runMigration, User, default as knex } from "./database.js";
import logger from "./logger.js";
import { hash } from "./password.js";

await runMigration();

if ((await User.query().count()) < 1) {
    logger.info(`Creating Admin User ${"admin"}`);

    await User.query().insert({
        username: "admin",
        password_hash: await hash("admin"),
        email: "admin@example.com",
        admin: true,
    });
}

await knex.destroy();
