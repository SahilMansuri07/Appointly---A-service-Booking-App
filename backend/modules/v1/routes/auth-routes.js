import express from "express";
import middleware from "../../../middleware/middleware.js";
import authValidation from "../validator/auth-validation.js";
import authController from "../controllers/auth-controller.js";

const router = express.Router();

router.post(
	"/sign-up",
	middleware.validateJoi(authValidation.signUpSchema),
	authController.signUp,
);

router.get("/profile", 
	middleware.allowRole("admin"), 
	authController.getProfile
);
router.post(
	"/login",
	middleware.validateJoi(authValidation.loginSchema),
	authController.login,
);

router.put(
	"/edit-profile",
	middleware.validateJoi(authValidation.editProfileSchema),
	middleware.allowRole("admin"),
	authController.editProfile,
);

router.patch(
	"/change-password",
	middleware.validateJoi(authValidation.changePasswordSchema),
	authController.changePassword,
);

router.get("/logout" , authController.logout);


export default router;
