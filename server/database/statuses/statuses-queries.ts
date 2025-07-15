import { StatusSchema } from "../../../types/database-types/status";
import knex from "../connection";
export const getByRoleIds = async (
  rolesIds: number[]
): Promise<StatusSchema[]> => {
  const statuses = await knex<StatusSchema>("statuses")
    .select("*")
    .whereIn("rolesIds", rolesIds);

  return statuses;
};
