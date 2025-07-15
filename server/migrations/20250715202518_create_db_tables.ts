import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("organizations", (table) => {
    table.increments("id");
    table.string("name").notNullable();
    table.string("country").notNullable();
    table.timestamp("createdAt").defaultTo(knex.fn.now());
    table.timestamp("updatedAt");
  });
  await knex.schema.createTable("roles", (table) => {
    table.increments("id");
    table.string("name").notNullable();
    table.string("description");
    table.smallint("orgId").references("organizations.id").notNullable();
    table.boolean("isAdmin").defaultTo(false);
    table.timestamp("createdAt").defaultTo(knex.fn.now());
    table.timestamp("updatedAt");
  });
  await knex.schema.createTable("users", (table) => {
    table.increments("id");
    table.string("username").notNullable();
    table.string("email").notNullable();
    table.string("pronouns");
    table.smallint("roleId").references("roles.id").notNullable();
    table.smallint("orgId").references("organizations.id").notNullable();
    table.timestamp("createdAt").defaultTo(knex.fn.now());
    table.timestamp("updatedAt");
  });
  await knex.schema.createTable("statuses", (table) => {
    table.increments("id");
    table.string("name").notNullable();
    table.timestamp("createdAt").defaultTo(knex.fn.now());
    table.timestamp("updatedAt");
  });

  await knex.schema.createTable("permissions", (table) => {
    table.increments("id");
    table.string("name").notNullable();
    table.smallint("roleId").references("roles.id").notNullable();
    table.smallint("statusId").references("statuses.id").notNullable();
    table.json("grants").defaultTo(JSON.stringify([]));
  });

  await knex.schema.createTable("tasks", (table) => {
    table.increments("id");
    table.string("title").notNullable();
    table.string("description");
    table.json("comments");
    table.smallint("statusId").references("statuses.id").notNullable();
    table.smallint("assigneeId").references("users.id");
    table.smallint("managerId").references("users.id");
    table.smallint("orgId").references("organizations.id").notNullable();
    table.date("dueDate");
    table.boolean("completed").defaultTo(false);
    table.timestamp("createdAt").defaultTo(knex.fn.now());
    table.timestamp("updatedAt");
  });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists("tasks");
    await knex.schema.dropTableIfExists("permissions");
    await knex.schema.dropTableIfExists("statuses");
    await knex.schema.dropTableIfExists("users");
    await knex.schema.dropTableIfExists("roles");
    await knex.schema.dropTableIfExists("organizations");
}
