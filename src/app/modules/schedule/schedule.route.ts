import express from "express";
import { UserRole } from "../../../../generated/prisma";
import auth from "../../middlewares/auth";
import { ScheduleControllers } from "./schedule.controller";
const router = express.Router();

router.get("/", auth(UserRole.DOCTOR), ScheduleControllers.getAllSchedules);

router.get(
  "/:id",
  auth(UserRole.DOCTOR, UserRole.ADMIN, UserRole.SUPER_ADMIN),
  ScheduleControllers.getScheduleByID
);

router.post(
  "/",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  ScheduleControllers.createSchedule
);

router.delete(
  "/",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  ScheduleControllers.createSchedule
);

export const ScheduleRoutes = router;
