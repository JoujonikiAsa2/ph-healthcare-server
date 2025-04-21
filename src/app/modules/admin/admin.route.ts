import express from "express";
import { AdminControllers } from "./admin.controller";
import { updateAdminValidationSchema } from "./admin.validation";
import { validateRequest } from "../../middlewares/validateRequest";

const router = express.Router();

router.get("/", AdminControllers.getAllAdmins);

router.get("/:id", AdminControllers.getAdminById);

router.patch(
  "/:id",
  validateRequest(updateAdminValidationSchema),
  AdminControllers.updateAdmin
);

router.delete("/:id", AdminControllers.deleteAdmin);

router.delete("/soft/:id", AdminControllers.softDeleteAdmin);

export const AdminRoutes = router;
