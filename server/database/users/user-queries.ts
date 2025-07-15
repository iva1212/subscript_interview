import { UserSchema } from "../../../types/database-types/user";
import knex from "../connection";

export async function getByEmail(email: string): Promise<UserSchema | null> {
  return knex("users").select("*").where({ email }).first();
}
