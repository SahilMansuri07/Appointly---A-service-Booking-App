import Codes from "../../../config/status_codes.js";
import db from "../../../config/db.js";
import query from "../../../config/dbHelper.js";
import middleware from "../../../middleware/middleware.js";
import common from "../../../config/common.js";

const helper = {
    async generateTimeSlots(startTime, endTime, slotDuration) {
        if (!startTime || !endTime || !slotDuration) return [];

        const slots = [];
        let start = new Date(`1970-01-01T${startTime}`);
        const end = new Date(`1970-01-01T${endTime}`);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) return [];

        while (start < end) {
            const formattedStart = start.toTimeString().slice(0, 5);
            let nextSlot = new Date(start.getTime() + slotDuration * 60000);
            if (nextSlot > end) break;
            const formattedEnd = nextSlot.toTimeString().slice(0, 5);

            slots.push({ start: formattedStart, end: formattedEnd });
            start = nextSlot;
        }

        return slots;
    },
}

const userModule = {

    async getServiceList(req , res){
        try{

            const services = await db.query(
                `SELECT s.id, s.service_name, s.description, s.duration_minutes, s.price, a.name AS admin_name 
                 FROM tbl_services s 
                 JOIN tbl_user a ON s.admin_id = a.id 
                 WHERE s.is_active = 1 AND s.is_delete = 0`
            );

            if(services[0].length === 0){
                return middleware.sendApiResponse(res, Codes.SUCCESS, Codes.SUCCESS, "No_services_available", null);
            }

            return middleware.sendApiResponse(res, Codes.SUCCESS, Codes.SUCCESS, "Service_list_retrieved_successfully", services[0]);
        
        }catch(error){
            console.error("Error occurred while fetching service list:", error);
            return middleware.sendApiResponse(res, Codes.ERROR, Codes.INTERNAL_SERVER_ERROR, "Internal_server_error", null);
        }
    },

   async getAvailableSlots(req, res) {
    try {
        const { service_id, date } = req.body;
        console.log("Received service_id:", service_id, "and date:", date);
        if (!service_id || !date) {
            return middleware.sendApiResponse(res, Codes.SUCCESS , Codes.RESPONSE_ERROR, "Service_id_and_date_are_required", null);
        }

        const [service] = await db.query(
            `SELECT * FROM tbl_services WHERE id = ? AND is_active = 1 AND is_delete = 0`,
            [service_id]
        );

        if (!service || service.length === 0) {
            return middleware.sendApiResponse(res, Codes.SUCCESS , Codes.RESPONSE_ERROR, "Service_not_found_or_inactive", null);
        }
        
        const [workingHours] = await db.query(
            `SELECT day_of_week, start_time, end_time FROM tbl_business_working_hours WHERE service_id = ? AND is_open = 1 AND is_delete = 0`,
            [service_id]
        );
        console.log("Working hours retrieved from DB:", workingHours);
        // Get day name from the selected date (e.g. "monday")
        const [year, month, day] = date.split('-').map(Number);
        const selectedDate = new Date(year, month - 1, day);
        const dayName = selectedDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();

        // Find working hours for that day
        const dayWorkingHours = workingHours.find(
            wh => wh.day_of_week?.toLowerCase() === dayName
        );

        // console.log("Working hours for the selected day:", dayWorkingHours);

        if (!dayWorkingHours) {
            console.log("No working hours found for the selected day:", dayName);
            return middleware.sendApiResponse(res, Codes.SUCCESS , Codes.RESPONSE_ERROR, "No_slots_available_for_this_day", []);
        }

        const slotDuration = service[0].duration_minutes;

        const timeSlots = await helper.generateTimeSlots(
            dayWorkingHours.start_time,
            dayWorkingHours.end_time,
            slotDuration
        );
        const bookedSlots = await db.query(
            `SELECT start_time, end_time FROM tbl_appointments WHERE service_id = ? AND appointment_date = ? AND status IN ('booked', 'completed')`,
            [service_id, date]
        );
        const availableSlots = timeSlots.filter(slot => {
            return !bookedSlots[0].some(booked => {
                return (slot.start < booked.end_time && slot.end > booked.start_time);
            });
        });

        return middleware.sendApiResponse(res, Codes.SUCCESS, Codes.RESPONSE_SUCCESS, "Available_slots_retrieved_successfully", availableSlots);
    } catch (error) {
        console.error("Error occurred while fetching available slots:", error);
        return middleware.sendApiResponse(res, Codes.INTERNAL_ERROR , Codes.RESPONSE_ERROR , "Internal_server_error", null);
    }
    },

    async bookAppointment(req, res) {
        try {
            // const userId = req.loginUser.id;
            const { service_id, appointment_date, start_time, end_time , user_name , email } = req.body;
            console.log("Received booking request:", { service_id, appointment_date, start_time, end_time , user_name , email });

            if (!service_id || !appointment_date || !start_time || !end_time) {
                return middleware.sendApiResponse(res, Codes.SUCCESS , Codes.RESPONSE_ERROR, "All_fields_are_required", null);
            }

            // Check if the service exists and is active
            const [service] = await db.query(
                `SELECT * FROM tbl_services WHERE id = ? AND is_active = 1 AND is_delete = 0`,
                [service_id]
            );

            if (!service || service.length === 0) {
                return middleware.sendApiResponse(res, Codes.SUCCESS , Codes.RESPONSE_ERROR, "Service_not_found_or_inactive", null);
            }

            // Insert the appointment
            const adminId = service[0].admin_id; // Get admin_id from the service
            const [result] = await query.insertQuery(
                "tbl_appointments",
                {
                    admin_id: adminId,
                    service_id,
                    user_name,
                    user_email: email,
                    appointment_date,
                    start_time,
                    end_time,
                    status: 'pending',
                }
            );

            if (!result || !result.insertId) {
                return middleware.sendApiResponse(res, Codes.SUCCESS , Codes.RESPONSE_ERROR, "Failed_to_book_appointment", null);
            }

            return middleware.sendApiResponse(res, Codes.SUCCESS , Codes.RESPONSE_SUCCESS, "Appointment_booked_successfully", { appointment_id: result.insertId });
        }catch (error) {
            console.error("Error occurred while booking appointment:", error);
            return middleware.sendApiResponse(res, Codes.INTERNAL_ERROR , Codes.RESPONSE_ERROR , "Internal_server_error", null);
        }
    },

    async serviceDetails(req, res) {
    try {
        const { service_id, type = "ASC" } = req.body;

        const [services] = await db.query(
            `SELECT id, service_name, description, duration_minutes, price
             FROM tbl_services
             WHERE id = ?
             AND is_active = 1
             AND is_delete = 0`,
            [service_id]
        );

        if (services.length === 0) {
            return middleware.sendApiResponse(
                res,
                Codes.SUCCESS,
                Codes.RESPONSE_ERROR,
                "No_services_available",
                null
            );
        }

        let orderBy = "ASC";

        if (type?.toUpperCase() === "DESC") {
            orderBy = "DESC";
        }

        const [appointmentsDetails] = await db.query(
            `SELECT date_format(appointment_date, '%Y-%m-%d') as Appoinment_Date , start_time, end_time, status
             FROM tbl_appointments
             WHERE service_id = ?
             AND is_active = 1
             AND is_delete = 0
             ORDER BY appointment_date ${orderBy}`,
            [service_id]
        );

        const result = {
            service: services[0],
            appointments: appointmentsDetails
        };

        return middleware.sendApiResponse(
            res,
            Codes.SUCCESS,
            Codes.RESPONSE_SUCCESS,
            "Service_details_fetched_successfully",
            result
        );

    } catch (error) {
        console.error("Error occurred while Fetching Service Details:", error);

        return middleware.sendApiResponse(
            res,
            Codes.INTERNAL_ERROR,
            Codes.RESPONSE_ERROR,
            "Internal_server_error",
            null
        );
    }
}
};

export default userModule;