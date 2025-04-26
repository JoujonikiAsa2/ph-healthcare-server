import multer from "multer";
import path from "path";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
import config from "../app/config";
import { ICloudinaryResponse, IFile } from "../app/interfaces/file";

const uploadToCloudinary = async (
  file: IFile
): Promise<ICloudinaryResponse | undefined> => {
  // console.log(file);

  // Configuration
  cloudinary.config({
    cloud_name: config.cloudinary_cloud_name,
    api_key: config.cloudinary_api_key,
    api_secret: config.cloudinary_api_secret,
  });

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      file.path,
      (error: Error, result: ICloudinaryResponse) => {
        fs.unlinkSync(file.path);
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
  });

  // Optimize delivery by resizing and applying auto-format and auto-quality
  // const optimizeUrl = cloudinary.url("shoes", {
  //   fetch_format: "auto",
  //   quality: "auto",
  // });

  // console.log(optimizeUrl);

  // Transform the image: auto-crop to square aspect_ratio
  // const autoCropUrl = cloudinary.url("shoes", {
  //   crop: "auto",
  //   gravity: "auto",
  //   width: 500,
  //   height: 500,
  // });

  // console.log(autoCropUrl);
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), "uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

export const fileUploader = {
  upload,
  uploadToCloudinary,
};
