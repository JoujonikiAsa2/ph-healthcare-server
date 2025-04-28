import express from "express";
import { UserRole } from "../../../../generated/prisma";
import auth from "../../middlewares/auth";
import { AppoinmentControllers } from "./appointment.controller";
const router = express.Router();

router.get(
  "/",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  AppoinmentControllers.getAllAppointments
);

router.get(
  "/my-appointment",
  auth(UserRole.DOCTOR, UserRole.PATIENT),
  AppoinmentControllers.getMyAppointment
);

router.post(
  "/",
  auth(UserRole.PATIENT),
  AppoinmentControllers.createAppointment
);

router.delete(
  "/my-appointment/:appointmentId",
  auth(UserRole.PATIENT),
  AppoinmentControllers.deleteAppointment
);

export const AppoinmentRoutes = router;
