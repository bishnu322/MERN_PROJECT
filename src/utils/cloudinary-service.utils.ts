import cloudinary from "../config/cloudinary.config";
import { CustomError } from "../middlewares/error-handler.middleware";
import fs from "fs";

export const uploadFile = async (path: string, dir = "/") => {
  try {
    const { public_id, secure_url } = await cloudinary.uploader.upload(path, {
      unique_filename: true,
      folder: "mern-kart" + dir,
    });

    //delete image from upload
    if (fs.existsSync(path)) {
      fs.unlinkSync(path);
    }

    return {
      public_id,
      path: secure_url,
    };
  } catch (error) {
    console.log(error);
    throw new CustomError("cloudinary file upload error", 500);
  }
};

export const deleteFile = async (public_ids: string[]) => {
  try {
    const PromisesRes = public_ids.map(async (public_id) => {
      return await cloudinary.uploader.destroy(public_id);
    });

    const res = await Promise.all(PromisesRes);

    return true;
  } catch (error) {
    throw new CustomError("file delete Error", 500);
  }
};
