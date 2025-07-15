import { BaseController } from "./base-controllers";
import { TaskSchema } from "../../types/database-types/tasks";
import { UserSchema } from "../../types/database-types/user";
import { RolesController } from "./roles-controllers";
import { StatusController } from "./status-controller";
import { getByStatusIds } from "../database/tasks/tasks-queries";

export class TasksController extends BaseController<TaskSchema> {
  rolesController = new RolesController();
  statusController = new StatusController();
  constructor() {
    super("tasks");
  }

  async all(user: UserSchema): Promise<TaskSchema[]> {
    try {
      const userRoles = await this.rolesController.getByUserId(user.id);
      const statuses = await this.statusController.getByRoleIds(
        userRoles.map((role) => role.id)
      );
      const tasks = await getByStatusIds(statuses.map((status) => status.id));
      return tasks;
    } catch (error) {
      console.error("Error ", error);
      throw new Error("Failed to fetch tasks");
    }
  }
}
