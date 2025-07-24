import multer from "multer";

export const uploader = () => {
  const upload = multer({ dest: "./upload" });

  return upload;
};
