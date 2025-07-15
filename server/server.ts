import app from "./server-config";
import getRoutes from "./server-routes";
import { cert, initializeApp, ServiceAccount } from "firebase-admin/app";
import * as serviceAccount from "../interviewproject-4f5c2-firebase-adminsdk-fbsvc-dc680abd79.json";
import { authMiddleware } from "./middlewares/auth.middleware";

const port = process.env.PORT || 5000;


initializeApp({
  credential: cert(serviceAccount as ServiceAccount),
});

const routes = getRoutes();
app.use(authMiddleware);
for (const route of routes) {
  console.log(`Registering route: ${route.method.toUpperCase()} ${route.url}`);
  app[route.method](route.url,route.middlewares, route.func);
}

if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => console.log(`Listening on port ${port}`));
}

export default app;
