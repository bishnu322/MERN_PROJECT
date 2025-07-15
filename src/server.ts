import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import { DB_CONNECTION } from "./config/db.config";
import { errorHandler } from "./middlewares/errorHandler.middleware";

const app = express();
const PORT = process.env.PORT || 3000;
const DB_URI = process.env.DB_URI ?? "";

//* calling database connection
DB_CONNECTION(DB_URI);

//*  Using middlewares
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ limit: "5mb", extended: true }));

// * Home route
app.get("/", (req: Request, res: Response) => {
  res.send("server is up and running");
});

//* All error routes
app.all("*", (req: Request, res: Response, next: NextFunction) => {});

// * errorHandler middleware called
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is listening on port http://localhost:${PORT}`);
});
