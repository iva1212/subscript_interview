import { BaseController } from "./base-controllers";
import { RoleSchema } from "../../types/database-types/roles";
import { getByUserId } from "../database/roles/roles-queries";

export class RolesController extends BaseController<RoleSchema> {
  constructor() {
    super("roles");
  }

  getByUserId(userId: number): Promise<RoleSchema[]> {
    return getByUserId(userId);
  }
}
