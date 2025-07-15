import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable("statuses", (table) => {
        table.json("rolesIds").defaultTo(JSON.stringify([])); // Adding rolesIds as a JSON array
    });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable("statuses", (table) => {
        table.dropColumn("rolesIds"); // Dropping rolesIds if rolling back
    });
}

