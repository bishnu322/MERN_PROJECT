import mongoose from "mongoose";

export const DB_CONNECTION = (DB_URI: string) => {
  mongoose
    .connect(DB_URI)
    .then(() => {
      console.log("DB connected successfully");
    })
    .catch((error) => {
      console.log("DB connection error", error);
    });
};
