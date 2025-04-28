import express from "express";
import { PatientControllers } from "./patient.controller";

const router = express.Router();

router.get("/", PatientControllers.getAllPatients);
router.patch("/:id", PatientControllers.updatePatiendData);
router.delete("/:id", PatientControllers.deletePatiendData);

export const PatientRoutes = router;
