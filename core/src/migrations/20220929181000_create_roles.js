/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = (knex) => {
    return knex.schema.createTable("Roles", (table) => {
        table.increments("id").notNullable().primary();
        table
            .integer("package_id")
            .notNullable()
            .references("Package.id")
            .onDelete("CASCADE");
        table
            .integer("user_id")
            .notNullable()
            .references("User.id")
            .onDelete("CASCADE");
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
