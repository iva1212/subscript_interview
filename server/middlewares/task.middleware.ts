import { Request, Response, NextFunction } from "express";
import { TasksController } from "../controllers/task-controller";
import { StatusController } from "../controllers/status-controller";
import { RolesController } from "../controllers/roles-controllers";
import { PermissionsController } from "../controllers/permissions-controller";
import {
  PermissionGrants,
  PermissionSchema,
} from "../../types/database-types/permissions";
import { UserController } from "../controllers/user-controllers";

export async function taskMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Middleware logic goes here
  const tasksController = new TasksController();
  const statusController = new StatusController();
  const rolesController = new RolesController();
  const userController = new UserController();
  const permissionsController = new PermissionsController();
  const taskId = req.params.id;
  const fireBaseUser = (req as any).user; // Assuming user info is attached by auth middleware
  try {
    const user = await userController.getUserByEmail(fireBaseUser.email);
    if (!user) {
      return res
        .status(403)
        .json({ error: "Forbidden: No user information available" });
    }
    if (!taskId || isNaN(Number(taskId))) {
      return res.status(400).json({ error: "Task ID is required" });
    }
    const task = await tasksController.get(Number(taskId));
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    const statusId = task.statusId;
    const status = await statusController.get(statusId);
    if (!status) {
      return res.status(404).json({ error: "Status not found for the task" });
    }
    const userRoleId = user.roleId;

    const permissions = await permissionsController.getByRoleId(userRoleId);
    if (permissions.length === 0) {
      return res
        .status(403)
        .json({ error: "Forbidden: No permissions for task" });
    }
    const requestType = req.method.toLowerCase();

    switch (requestType) {
      case "get":
        if (
          !permissions.some((p: PermissionSchema) =>
            p.grants.includes(PermissionGrants.READ)
          )
        ) {
          return res
            .status(403)
            .json({ error: "Forbidden: No view permission" });
        }
        break;
      case "post":
      case "put":
        if (
          !permissions.some((p: PermissionSchema) =>
            p.grants.includes(PermissionGrants.WRITE)
          )
        ) {
          return res
            .status(403)
            .json({ error: "Forbidden: No write permission" });
        }
        break;
      case "delete":
        if (
          !permissions.some((p: PermissionSchema) =>
            p.grants.includes(PermissionGrants.DELETE)
          )
        ) {
          return res
            .status(403)
            .json({ error: "Forbidden: No Delete permission" });
        }
        break;
    }
    next();
  } catch (error) {
    console.error("Error in taskMiddleware: ", error);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
}
