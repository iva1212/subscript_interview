import { OrganizationController } from "./controllers/org-controllers";
import { PermissionsController } from "./controllers/permissions-controller";
import { RolesController } from "./controllers/roles-controllers";
import { StatusController } from "./controllers/status-controller";
import { TasksController } from "./controllers/task-controller";
import { UserController } from "./controllers/user-controllers";
import { adminMiddleware } from "./middlewares/admin.middleware";
import { taskMiddleware } from "./middlewares/task.middleware";
import { BaseRoutes } from "./routes/base-route";

export default function getRoutes() {
  const controllers = {
    users: new UserController(),
    tasks: new TasksController(),
    roles: new RolesController(),
    permissions: new PermissionsController(),
    organizations: new OrganizationController(),
    statuses: new StatusController(),
  };

  const routes: {
    url: string;
    method: string;
    func: (req: any, res: any) => void;
    middlewares?: any[];
  }[] = [];

  for (const key in controllers) {
    if (controllers.hasOwnProperty(key)) {
      const controller = controllers[key];
      const routesClass = new BaseRoutes(controller, key);
      const controllerRoutes = routesClass.getRoutes();
      controllerRoutes.forEach((route) => {
        const middlewares = getMiddleWare(key, route.name);
        routes.push({
          url: route.suffix,
          method: route.httpMethod,
          func: routesClass.addErrorReporting(route.method, route.errorMessage),
          middlewares,
        });
      });
    }
  }
  return routes;
}

function getMiddleWare(key: string, name: string) {
  switch (key) {
    case "users":
      return [adminMiddleware];
    case "tasks":
      if (name === "create" || name === "all") {
        return [];
      }
      return [taskMiddleware];
    case "roles":
      return [adminMiddleware];
    case "permissions":
      return [adminMiddleware];
    case "organizations":
      return [adminMiddleware];
    case "status":
      return [adminMiddleware];
    default:
      return [];
  }
}
