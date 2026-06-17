import Joi from "joi";

const authValidation = {
    // Sign Up
    signUpSchema: Joi.object({
        name: Joi.string().max(100).optional(),
        email: Joi.string().email().required(),
        country_code: Joi.string().max(5).optional(),
        mobile_number: Joi.string().optional(),
        password: Joi.string().min(6).required(),
        role: Joi.string().valid("user", "admin").optional(),
        login_type: Joi.string().valid("s", "g").optional(),
        uuid: Joi.string().optional(),
    })
    .with("mobile_number", "country_code")
    .with("country_code", "mobile_number"),

    // Validate User (Send OTP for signup)
    validateUserSchema: Joi.object({
        email: Joi.string().email().optional(),
        username: Joi.string().min(3).max(50).optional(),
        mobile_number: Joi.string().optional(),
        country_code: Joi.string().max(5).optional(),
        name: Joi.string().max(100).optional(),
    })
    .or("email", "username", "mobile_number")
    .with("mobile_number", "country_code")
    .with("country_code", "mobile_number"),

    // Verify OTP by Purpose (signup, forgot_password, update_profile)
    verifyOtpByPurposeSchema: Joi.object({
        first_name: Joi.string().max(50).optional(),
        last_name: Joi.string().max(50).optional(),
        username: Joi.string().min(3).max(50).optional(),
        password: Joi.string().min(6).optional(),
        email: Joi.string().email().optional(),
        country_code: Joi.string().max(5).optional(),
        mobile_number: Joi.string().optional(),
        otp: Joi.string().length(6).required(),
        otpPurpose: Joi.string().valid("signup", "forgot_password", "update_profile").required(),
    })
    .or("email", "mobile_number")
    .with("mobile_number", "country_code")
    .with("country_code", "mobile_number"),

    // Resend OTP
    resendOtpSchema: Joi.object({
        email: Joi.string().email().optional(),
        country_code: Joi.string().max(5).optional(),
        mobile_number: Joi.string().optional(),
    })
    .xor("email", "mobile_number")
    .with("mobile_number", "country_code")
    .with("country_code", "mobile_number"),

    // Forget Password (Request password reset)
    forgetPasswordSchema: Joi.object({
        email: Joi.string().email().optional(),
        country_code: Joi.string().max(5).optional(),
        mobile_number: Joi.string().optional(),
    })
    .xor("email", "mobile_number")
    .with("mobile_number", "country_code")
    .with("country_code", "mobile_number"),

    // Reset Password
    resetPasswordSchema: Joi.object({
        email: Joi.string().email().optional(),
        country_code: Joi.string().max(5).optional(),
        mobile_number: Joi.string().optional(),
        new_password: Joi.string().min(6).required(),
    })
    .or("email", "mobile_number")
    .with("mobile_number", "country_code")
    .with("country_code", "mobile_number"),

    // Login
    loginSchema: Joi.object({
        email: Joi.string().email().optional(),
        country_code: Joi.string().max(5).optional(),
        mobile_number: Joi.string().optional(),
        password: Joi.string().min(6).required(),
        uuid: Joi.string().optional(),
    })
    .or("email", "mobile_number")
    .with("mobile_number", "country_code")
    .with("country_code", "mobile_number"),
    

    // Change Password (Authenticated user)
    changePasswordSchema: Joi.object({
        old_password: Joi.string().min(6).required(),
        new_password: Joi.string().min(6).required(),
    }),

    // Change Language (Authenticated user)
    changeLanguageSchema: Joi.object({
        language: Joi.string().valid("en", "eng", "english", "ar", "hi", "hin", "hindi", "fr", "span", "es").optional(),
        lang: Joi.string().valid("en", "eng", "english", "ar", "hi", "hin", "hindi", "fr", "span", "es").optional(),
    }).min(1),

    // Edit Profile — Step 1: update non-sensitive fields (name, username, bio, image)
    // email/mobile are intentionally excluded here — they go through OTP flow below
    editProfileSchema: Joi.object({
        name: Joi.string().max(50).optional(),
        email: Joi.string().email().optional(),
        country_code: Joi.string().max(5).optional(),
        mobile_number: Joi.string().optional(),
     }).min(1),

    // Edit Profile — Step 2a: send OTP to new email/mobile before updating
    // at least one identifier and full mobile pair

    // Edit Profile — Step 2b: verify OTP then apply email/mobile update
    // reuses verifyOtpByPurposeSchema with otpPurpose = "update_profile"
    // no separate schema needed — just enforce it via the shared one above

    // Verify OTP for Signup
    verifyOtpSchema: Joi.object({
        first_name: Joi.string().max(50).optional(),
        last_name: Joi.string().max(50).optional(),
        username: Joi.string().min(3).max(50).optional(),
        password: Joi.string().min(6).optional(),
        email: Joi.string().email().optional(),
        country_code: Joi.string().max(5).optional(),
        mobile_number: Joi.string().optional(),
        otp: Joi.string().length(6).required(),
    })
    .or("email", "mobile_number")
    .with("mobile_number", "country_code")
    .with("country_code", "mobile_number"),

    // Forgot Password Verify OTP
    forgotPasswordVerifyOtpSchema: Joi.object({
        email: Joi.string().email().optional(),
        country_code: Joi.string().max(5).optional(),
        mobile_number: Joi.string().optional(),
        otp: Joi.string().length(6).required(),
    })
    .xor("email", "mobile_number")
    .with("mobile_number", "country_code")
    .with("country_code", "mobile_number"),
};

export default authValidation;