import express from "express";
import { UserRoutes } from "../modules/user/user.route";
import { AdminRoutes } from "../modules/admin/admin.route";
import { AuthRoutes } from "../modules/auth/auth.route";
import { SpecialtiesRoutes } from "../modules/specialties/specialties.route";
import { DoctorRoutes } from "../modules/doctor/doctor.route";
import { PatientRoutes } from "../modules/patient/patient.route";
import { ScheduleRoutes } from "../modules/schedule/schedule.route";
import { DoctorScheduleRoutes } from "../modules/doctorSchedule/doctorSchedule.route";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/users",
    route: UserRoutes,
  },
  {
    path: "/admins",
    route: AdminRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/specialties",
    route: SpecialtiesRoutes,
  },
  {
    path: "/doctors",
    route: DoctorRoutes,
  },
  {
    path: "/patients",
    route: PatientRoutes,
  },
  {
    path: "/schedules",
    route: ScheduleRoutes,
  },
  {
    path: "/doctor-schedules",
    route: DoctorScheduleRoutes,
  },
];

moduleRoutes.forEach(({path, route}) => router.use(path, route));

export default router;
