import { RoleSchema } from "../../../types/database-types/roles";
import knex from "../connection";

export async function getByUserId(userId: number): Promise<RoleSchema[]> {
  return knex("roles").select("*").where({ userId });
}