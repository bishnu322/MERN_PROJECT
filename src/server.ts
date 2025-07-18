import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import { DB_CONNECTION } from "./config/db.config";
import {
  CustomError,
  errorHandler,
} from "./middlewares/errorHandler.middleware";

//* importing routes

import authRouter from "./routers/auth.routes";
import userRouter from "./routers/user.routers";
import brandRouter from "./routers/brand.routes";
import categoryRouter from "./routers/category.routes";

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

// routers
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/brand", brandRouter);
app.use("/api/category", categoryRouter);

//* All error routes
app.all("/{*all}", (req: Request, res: Response, next: NextFunction) => {
  const message = `cannot ${req.method} on path ${req.originalUrl}`;
  const error = new CustomError(message, 404);

  next(error);
});

app.listen(PORT, () => {
  console.log(`Server is listening on port http://localhost:${PORT}`);
});

// * errorHandler middleware called
app.use(errorHandler);
