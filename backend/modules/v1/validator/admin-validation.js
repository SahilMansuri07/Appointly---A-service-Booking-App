import Joi from "joi";

const adminValidation = {
    // Job Listing


    // Create Service
    createServiceSchema: Joi.object({
        service_id: Joi.number().integer().positive().optional(),
        service_name: Joi.string().max(255).required(),
        description: Joi.string().optional(),
        duration_minutes: Joi.number().integer().positive().required(),
        price: Joi.number().precision(2).positive().required(),
        working_hours: Joi.array().items(Joi.object({
            day: Joi.string().valid("MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY").required(),
            start_time: Joi.string().required(),
            end_time: Joi.string().required()
        })).min(1).required()
    }),

    // Update Appointment Status
    updateAppointmentSchema: Joi.object({
        appointment_id: Joi.number().integer().positive().required(),
        status: Joi.string().valid("pending", "completed", "cancelled").required(),
    }),
    
};

export default adminValidation;
