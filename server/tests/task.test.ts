import { Request, Response } from "express";
import { taskMiddleware } from "../middlewares/task.middleware";
import { TasksController } from "../controllers/task-controller";
import { StatusController } from "../controllers/status-controller";
import { RolesController } from "../controllers/roles-controllers";
import { PermissionsController } from "../controllers/permissions-controller";
import { UserController } from "../controllers/user-controllers";
import { PermissionGrants } from "../../types/database-types/permissions";

jest.mock("../controllers/task-controller");
jest.mock("../controllers/status-controller");
jest.mock("../controllers/roles-controllers");
jest.mock("../controllers/permissions-controller");
jest.mock("../controllers/user-controllers");

const mockNext = jest.fn();

function mockRes() {
    const res: Partial<Response> = {};
    res.status = jest.fn().mockReturnThis();
    res.json = jest.fn().mockReturnThis();
    return res as Response;
}

describe("taskMiddleware", () => {
    let req: Partial<Request>;
    let res: Response;

    beforeEach(() => {
        jest.clearAllMocks();
        req = {
            params: { id: "1" },
            method: "GET",
            user: { email: "test@example.com" },
        } as any;
        res = mockRes();
    });

    it("should return 403 if user not found", async () => {
        (UserController.prototype.getUserByEmail as any).mockResolvedValue(null);

        await taskMiddleware(req as Request, res, mockNext);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({
            error: "Forbidden: No user information available",
        });
        expect(mockNext).not.toHaveBeenCalled();
    });

    it("should return 400 if taskId is missing or invalid", async () => {
        req.params = {};
        (UserController.prototype.getUserByEmail as any).mockResolvedValue({ roleId: 1 });

        await taskMiddleware(req as Request, res, mockNext);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "Task ID is required" });
        expect(mockNext).not.toHaveBeenCalled();
    });

    it("should return 404 if task not found", async () => {
        (UserController.prototype.getUserByEmail as any).mockResolvedValue({ roleId: 1 });
        (TasksController.prototype.get as any).mockResolvedValue(null);

        await taskMiddleware(req as Request, res, mockNext);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: "Task not found" });
        expect(mockNext).not.toHaveBeenCalled();
    });

    it("should return 404 if status not found", async () => {
        (UserController.prototype.getUserByEmail as any).mockResolvedValue({ roleId: 1 });
        (TasksController.prototype.get as any).mockResolvedValue({ statusId: 2 });
        (StatusController.prototype.get as any).mockResolvedValue(null);

        await taskMiddleware(req as Request, res, mockNext);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: "Status not found for the task" });
        expect(mockNext).not.toHaveBeenCalled();
    });

    it("should return 403 if no permissions for task", async () => {
        (UserController.prototype.getUserByEmail as any).mockResolvedValue({ roleId: 1 });
        (TasksController.prototype.get as any).mockResolvedValue({ statusId: 2 });
        (StatusController.prototype.get as any).mockResolvedValue({ id: 2 });
        (PermissionsController.prototype.getByRoleId as any).mockResolvedValue([]);

        await taskMiddleware(req as Request, res, mockNext);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ error: "Forbidden: No permissions for task" });
        expect(mockNext).not.toHaveBeenCalled();
    });

    it("should return 403 if no READ permission for GET", async () => {
        (UserController.prototype.getUserByEmail as any).mockResolvedValue({ roleId: 1 });
        (TasksController.prototype.get as any).mockResolvedValue({ statusId: 2 });
        (StatusController.prototype.get as any).mockResolvedValue({ id: 2 });
        (PermissionsController.prototype.getByRoleId as any).mockResolvedValue([
            { grants: [] },
        ]);
        req.method = "GET";

        await taskMiddleware(req as Request, res, mockNext);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ error: "Forbidden: No view permission" });
        expect(mockNext).not.toHaveBeenCalled();
    });

    it("should return 403 if no WRITE permission for POST/PUT", async () => {
        (UserController.prototype.getUserByEmail as any).mockResolvedValue({ roleId: 1 });
        (TasksController.prototype.get as any).mockResolvedValue({ statusId: 2 });
        (StatusController.prototype.get as any).mockResolvedValue({ id: 2 });
        (PermissionsController.prototype.getByRoleId as any).mockResolvedValue([
            { grants: [PermissionGrants.READ] },
        ]);
        req.method = "POST";

        await taskMiddleware(req as Request, res, mockNext);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ error: "Forbidden: No write permission" });
        expect(mockNext).not.toHaveBeenCalled();
    });

    it("should return 403 if no DELETE permission for DELETE", async () => {
        (UserController.prototype.getUserByEmail as any).mockResolvedValue({ roleId: 1 });
        (TasksController.prototype.get as any).mockResolvedValue({ statusId: 2 });
        (StatusController.prototype.get as any).mockResolvedValue({ id: 2 });
        (PermissionsController.prototype.getByRoleId as any).mockResolvedValue([
            { grants: [PermissionGrants.READ, PermissionGrants.WRITE] },
        ]);
        req.method = "DELETE";

        await taskMiddleware(req as Request, res, mockNext);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ error: "Forbidden: No Delete permission" });
        expect(mockNext).not.toHaveBeenCalled();
    });

    it("should call next() if permission is granted for GET", async () => {
        (UserController.prototype.getUserByEmail as any).mockResolvedValue({ roleId: 1 });
        (TasksController.prototype.get as any).mockResolvedValue({ statusId: 2 });
        (StatusController.prototype.get as any).mockResolvedValue({ id: 2 });
        (PermissionsController.prototype.getByRoleId as any).mockResolvedValue([
            { grants: [PermissionGrants.READ] },
        ]);
        req.method = "GET";

        await taskMiddleware(req as Request, res, mockNext);

        expect(mockNext).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
    });

    it("should call next() if permission is granted for POST", async () => {
        (UserController.prototype.getUserByEmail as any).mockResolvedValue({ roleId: 1 });
        (TasksController.prototype.get as any).mockResolvedValue({ statusId: 2 });
        (StatusController.prototype.get as any).mockResolvedValue({ id: 2 });
        (PermissionsController.prototype.getByRoleId as any).mockResolvedValue([
            { grants: [PermissionGrants.WRITE] },
        ]);
        req.method = "POST";

        await taskMiddleware(req as Request, res, mockNext);

        expect(mockNext).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
    });

    it("should call next() if permission is granted for DELETE", async () => {
        (UserController.prototype.getUserByEmail as any).mockResolvedValue({ roleId: 1 });
        (TasksController.prototype.get as any).mockResolvedValue({ statusId: 2 });
        (StatusController.prototype.get as any).mockResolvedValue({ id: 2 });
        (PermissionsController.prototype.getByRoleId as any).mockResolvedValue([
            { grants: [PermissionGrants.DELETE] },
        ]);
        req.method = "DELETE";

        await taskMiddleware(req as Request, res, mockNext);

        expect(mockNext).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
    });

    it("should return 500 on unexpected error", async () => {
        (UserController.prototype.getUserByEmail as any).mockRejectedValue(new Error("Unexpected"));

        await taskMiddleware(req as Request, res, mockNext);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: "Internal server error" });
        expect(mockNext).not.toHaveBeenCalled();
    });
});