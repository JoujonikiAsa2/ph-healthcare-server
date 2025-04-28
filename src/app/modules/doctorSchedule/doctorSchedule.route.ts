import express from "express";
import { UserRole } from "../../../../generated/prisma";
import auth from "../../middlewares/auth";
import { DoctorScheduleControllers } from "./doctorSchedule.controller";
const router = express.Router();

router.get(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT),
  DoctorScheduleControllers.getAllDoctorSchedules
);

router.get(
  "/my-schedule",
  auth(UserRole.DOCTOR),
  DoctorScheduleControllers.getMySchedules
);

router.post(
  "/",
  auth(UserRole.DOCTOR),
  DoctorScheduleControllers.createDoctorSchedule
);

router.delete(
  "/:scheduleId",
  auth(UserRole.DOCTOR),
  DoctorScheduleControllers.deleteDpctorSchedule
);

export const DoctorScheduleRoutes = router;
