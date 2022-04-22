/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = (knex) => {
    return knex.schema.createTable("PackageVersions", (table) => {
        table.increments("id").notNullable().primary();
        table
            .integer("package_id")
            .notNullable()
            .references("Package.id")
            .onDelete("CASCADE");
        table.string("version").notNullable();
        table.string("digest");
        table.timestamps();

        table.unique(["package_id", "version"], {
            indexName: "package_version_index",
        });
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = (knex) => {
    return knex.schema.dropTableIfExists("PackageVersions");
};
