import { BaseController } from "./base-controllers";
import { StatusSchema } from "../../types/database-types/status";
import { getByRoleIds } from "../database/statuses/statuses-queries";

export class StatusController extends BaseController<StatusSchema> {
  constructor() {
    super("statuses");
  }

  getByRoleIds(rolesIds: number[]): Promise<StatusSchema[]> {
    return getByRoleIds(rolesIds);
  }
}
