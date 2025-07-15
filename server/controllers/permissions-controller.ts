import { BaseController } from "./base-controllers";
import { PermissionSchema } from "../../types/database-types/permissions";
import { getByRoleIds } from "../database/permissions/permissions-queries";

export class PermissionsController extends BaseController<PermissionSchema> {
  constructor() {
    super("permissions");
  }

  getByRoleId(roleId: number): Promise<PermissionSchema[]> {
    return getByRoleIds(roleId);
  }
}
