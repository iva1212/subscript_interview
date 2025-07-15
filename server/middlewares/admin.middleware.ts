import { Request, Response, NextFunction } from "express";
import { UserController } from "../controllers/user-controllers";

export async function adminMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const user = (req as any).user; // Assuming user info is attached by auth middleware
  if (!user) {
    return res
      .status(403)
      .json({ error: "Forbidden: No user information available" });
  }
  const email = user.email;
  if (!email) {
    return res
      .status(403)
      .json({ error: "Forbidden: No email associated with user" });
  }
  const userController = new UserController();
  const userRow = await userController.getUserByEmail(email);
  if (!userRow || !userRow.isAdmin) {
    return res.status(403).json({ error: "Forbidden: User is not an admin" });
  }
  next();
}
