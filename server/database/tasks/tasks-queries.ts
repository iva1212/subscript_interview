
import { TaskSchema } from "../../../types/database-types/tasks";
import knex from "../connection";
export const getByStatusIds = async (
  statusIds: number[]
): Promise<TaskSchema[]> => {
  const statuses = await knex<TaskSchema>("tasks")
    .select("*")
    .whereIn("statusId", statusIds);
  return statuses;
};
