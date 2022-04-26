/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = (knex) => {
    return knex.schema.createTable("Plugins", (table) => {
        table.increments("id").notNullable().primary();
        table.string("name").notNullable();
        table.string("type").notNullable();
        table.string("location").notNullable();
        table.string("version");
        table.timestamps(false, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = (knex) => {
    return knex.schema.dropTableIfExists("Plugins");
};
