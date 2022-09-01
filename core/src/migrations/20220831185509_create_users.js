/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = (knex) => {
    return knex.schema.createTable("Users", (table) => {
        table.increments("id").notNullable().primary();
        table.string("username").notNullable();
        table.string("password_hash").notNullable();
        table.string("email").notNullable();
        table.timestamps(false, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = (knex) => {
    return knex.schema.dropTableIfExists("Users");
};
