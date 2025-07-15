import { PermissionSchema } from "../../../types/database-types/permissions";
import knex from "../connection";

export async function getByRoleIds(
  roleId: number
): Promise<PermissionSchema[]> {
  return knex("permissions").select("*").where({ roleId });
}
