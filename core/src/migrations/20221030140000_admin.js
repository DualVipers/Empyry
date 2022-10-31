/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
    await knex.schema.alterTable("Tokens", (table) => {
        table.boolean("admin").defaultTo(false).notNullable();
    });

    return knex.schema.alterTable("Users", (table) => {
        table.boolean("admin").defaultTo(false).notNullable();
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
    knex.schema.alterTable("Tokens", (table) => {
        table.dropColumn("admin");
    });

    return knex.schema.alterTable("Users", (table) => {
        table.dropColumn("admin");
    });
};
