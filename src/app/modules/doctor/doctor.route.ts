import express from "express";
import { UserRole } from "../../../../generated/prisma";
import auth from "../../middlewares/auth";
import { DoctorControllers } from "./doctor.controller";
const router = express.Router();

router.get(
  "/",
  DoctorControllers.getAllDoctors
);

router.patch(
  "/:id",
  DoctorControllers.updateDoctorInfo
);


export const DoctorRoutes = router;
