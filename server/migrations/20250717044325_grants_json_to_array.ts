import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("permissions", (table) => {
    table.dropColumn("grants"); // Dropping grants if rolling back
  });
  await knex.schema.alterTable("permissions", (table) => {
    table.specificType("grants", "TEXT[]");
  });
  // Using JSON[] to store an array of JSON objects
  // This allows for more complex structures within the grants field
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("permissions", (table) => {
    table.json("grants").defaultTo(JSON.stringify([])); // Adding grants as a JSON array
  });
}
