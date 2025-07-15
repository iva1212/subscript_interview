import * as dotenv from "dotenv";
import * as express from "express";
import { Application, Request, Response, NextFunction } from "express";
import * as bodyParser from "body-parser";
const cors = require('cors');

dotenv.config();

const app: Application = express();

app.use(cors({ origin: "http://localhost:3000" }));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

export default app;
