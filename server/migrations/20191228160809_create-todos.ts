import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('todos', (table) => {
        table.increments('id');
        table.string('title');
        table.integer('order');
        table.boolean('completed').defaultTo(false);
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('todos');
}
