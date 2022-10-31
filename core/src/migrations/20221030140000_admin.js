/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = (knex) => {
    return knex.schema.alterTable("Users", (table) => {
        table.boolean("admin").defaultTo(false).notNullable();
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = (knex) => {
    return knex.schema.alterTable("Users", (table) => {
        table.dropColumn("admin");
    });
};
