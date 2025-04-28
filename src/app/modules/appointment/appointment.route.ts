import express from "express";
import { UserRole } from "../../../../generated/prisma";
import auth from "../../middlewares/auth";
import { AppoinmentControllers } from "./appointment.controller";
const router = express.Router();

router.get("/", auth(UserRole.DOCTOR), AppoinmentControllers.getAllAppointments);

router.get(
  "/:id",
  auth(UserRole.DOCTOR, UserRole.ADMIN, UserRole.SUPER_ADMIN),
  AppoinmentControllers.getAppointmentByID
);

router.post(
  "/",
  auth(UserRole.PATIENT),
  AppoinmentControllers.createAppointment
);

router.delete(
  "/",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  AppoinmentControllers.deleteAppointment
);

export const AppoinmentRoutes = router;
