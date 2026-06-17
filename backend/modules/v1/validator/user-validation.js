import Joi from "joi";

const userValidation = {
    
    bookAppointmentSchema: Joi.object({
        service_id: Joi.number().integer().required().messages({
            "any.required": "Service ID is required",
            "number.base": "Service ID must be a number",
            "number.integer": "Service ID must be an integer",
        }),
        appointment_date: Joi.date().iso().required().messages({
            "any.required": "Appointment date is required",
            "date.base": "Appointment date must be a valid date",
            "date.format": "Appointment date must be in ISO format (YYYY-MM-DD)",
        }),
        start_time: Joi.string().pattern(/^\d{2}:\d{2}$/).required().messages({
            "any.required": "Start time is required",
            "string.pattern.base": "Start time must be in HH:mm format",
        }),
        end_time: Joi.string().pattern(/^\d{2}:\d{2}$/).required().messages({
            "any.required": "End time is required",
            "string.pattern.base": "End time must be in HH:mm format",
        }),
        user_name: Joi.string().required().messages({
            "any.required": "User name is required",
            "string.base": "User name must be a string",
        }),
        email: Joi.string().email().required().messages({
            "any.required": "Email is required",
            "string.email": "Email must be a valid email address",
        }),
    }), 

    // getAvailableSlotsSchema: Joi.object({
    //     service_id: Joi.number().integer().required().messages({
    //         "any.required": "Service ID is required",
    //         "number.base": "Service ID must be a number",
    //         "number.integer": "Service ID must be an integer",
    //     }),
    // }),
};

export default userValidation;
