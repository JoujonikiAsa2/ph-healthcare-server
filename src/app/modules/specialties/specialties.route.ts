import express, { Request, Response, NextFunction } from "express";
import { UserRole } from "../../../../generated/prisma";
import { SpecialtiesControllers } from "./specialties.controller";
import auth from "../../middlewares/auth";
import { fileUploader } from "../../../helpers/fileUploader";
import { SpecialtiesSchemaValidation } from "./specialties.validation";
const router = express.Router();

router.get("/", SpecialtiesControllers.getSpecialties);

router.post(
  "/",
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = SpecialtiesSchemaValidation.create.parse(
      JSON.parse(req.body.data)
    );
    console.log(req.body);
    return SpecialtiesControllers.createSpecialties(req, res, next);
  }
);

router.delete("/:id",auth(UserRole.SUPER_ADMIN, UserRole.ADMIN), SpecialtiesControllers.deleteSpecialties);

export const SpecialtiesRoutes = router;
