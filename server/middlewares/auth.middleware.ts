import { Request, Response, NextFunction } from "express";
import { getAuth } from "firebase-admin/auth";
export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Authentication logic goes here
  if (!req.headers?.authorization) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const parsedToken  = req.headers.authorization.replace("Bearer ", "");
  // Assuming Firebase Admin SDK is initialized and getAuth is available
  let auth = getAuth();
  auth
    .verifyIdToken(parsedToken)
    .then((decodedToken) => {
      (req as any).user = decodedToken; // Attach user info to request
      next();
    })
    .catch((error) => {
      console.error("Authentication error:", error);
      res.status(401).json({ error: "Unauthorized" });
    });
}
