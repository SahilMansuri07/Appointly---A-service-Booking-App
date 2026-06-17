import express from "express";
import middleware from "../../../middleware/middleware.js";
import adminValidation from "../validator/admin-validation.js";
import adminController from "../controllers/admin-controller.js";

const router = express.Router();
 

router.post(
	"/create-service",
	middleware.allowRole("admin"),
	middleware.validateJoi(adminValidation.createServiceSchema),
	adminController.createService,
);

router.patch(
	"/edit-service",
	middleware.allowRole("admin"),
	middleware.validateJoi(adminValidation.createServiceSchema),
	adminController.updateService,
);

router.patch(
	"/manage-working-hours",
	middleware.allowRole("admin"),
	adminController.manageWorkingHours,
);


router.get(
	"/dashboard",
	middleware.allowRole("admin"),
	adminController.dashboard
);

router.get(
	"/list-appointments",
	middleware.allowRole("admin"),
	adminController.listAppointments
);

router.patch(
	"/update-appointment-status",
	middleware.allowRole("admin"),
	middleware.validateJoi(adminValidation.updateAppointmentSchema),
	adminController.updateAppointmentStatus
)

router.get(
	"/list-services",
	middleware.allowRole("admin"),
	adminController.listServices
)
export default router;
