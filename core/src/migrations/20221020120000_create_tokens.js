/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = (knex) => {
    return knex.schema.createTable("Tokens", (table) => {
        table.increments("id").notNullable().primary();
        table
            .integer("user_id")
            .notNullable()
            .references("User.id")
            .onDelete("CASCADE");
        table.string("token").notNullable();
        table.integer("expire").notNullable();
        table.timestamps(false, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = (knex) => {
    return knex.schema.dropTableIfExists("Roles");
};
