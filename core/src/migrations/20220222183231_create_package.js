/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = (knex) => {
    return knex.schema.createTable("Packages", (table) => {
        table.increments("id").notNullable().primary();
        table.string("name").notNullable();
        table.string("platorm").notNullable();
        table.string("description");
        table.string("source");
        table.string("home");
        table.string("license");
        table.date("created_at").notNullable().defaultTo(knex.fn.now());
        table.date("updated_at").notNullable().defaultTo(knex.fn.now());
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = (knex) => {
    return knex.schema.dropTableIfExists("Packages");
};
