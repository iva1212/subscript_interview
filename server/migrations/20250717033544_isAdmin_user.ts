import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable("users", (table) => {
        table.boolean("isAdmin").defaultTo(false); // Adding isAdmin column to users table
    });
    // remove isAdmin from roles table if it exists
    await knex.schema.alterTable("roles", (table) => {
        table.dropColumn("isAdmin");
    });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable("users", (table) => {
        table.dropColumn("isAdmin"); // Dropping isAdmin if rolling back
    });
    // add isAdmin back to roles table if it was removed
    await knex.schema.alterTable("roles", (table) => {
        table.boolean("isAdmin").defaultTo(false); // Re-adding isAdmin to roles table
    });
}

