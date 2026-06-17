import express from "express";
import middleware from "../../../middleware/middleware.js";
import userValidation from "../validator/user-validation.js";
import userController from "../controllers/user-controller.js";
import common from "../../../config/common.js";

const router = express.Router();

router.get(
	"/service-list",
	userController.getServiceList,
);

router.post(
	"/get-available-slots",
	// middleware.validateJoi(userValidation.getAvailableSlotsSchema),
	userController.getAvailableSlots,
);

router.post(
	"/book-appointment",
	// middleware.validateJoi(userValidation.bookAppointmentSchema),
	userController.bookAppointment,
);


router.post(
	"/service-details",
	userController.serviceDetails,
)

export default router;