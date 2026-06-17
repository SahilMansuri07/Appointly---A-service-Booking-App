import Codes from "../../../config/status_codes.js";
import db from "../../../config/db.js";
import query from "../../../config/dbHelper.js";
import middleware from "../../../middleware/middleware.js";
import common from "../../../config/common.js";
import { createOtpWmailTemplate } from "../../../config/mail.js";

const adminModule = {

      async sendOtpByEmail(username, email) {
    
        const html = createOtpWmailTemplate({
            userName: username || "User",
        });
        
        const subject = "Your Appointment Status";
        
        const mailResult = await common.sendConfirmationMail({
            toEmail: email,
            subject,
            htmlMessage: html,
        });
        
        if (mailResult?.skipped) {
            console.warn("OTP email skipped:", mailResult.reason);
        }
    },

    async createService(req, res) {
        try {
            const adminId = req.loginUser?.id;
            const { service_name, description , duration_minutes , price , working_hours  } = req.body;
            console.log("working houts" , working_hours)
            // const existingService = await db.query(
            //     `SELECT s.id ,  FROM tbl_services s JOIN  tbl_business_working_hours bq ON s.id = bq.service_id WHERE service_name = ? AND user_id = ? AND is_active = 1 AND is_delete = 0 `,
            //     [service_name, adminId]
            // );

            // if (existingService[0]) {
            //     return middleware.sendApiResponse(res, Codes.SUCCESS, Codes.RESPONSE_ERROR, "SERVICE_ALREADY_EXISTS", null);
            // }

            const insertData = {
                admin_id: adminId,
                service_name,
                description : description || null,
                duration_minutes,
                price,
                // working_hours : working_hours || null
            };

            const [data] = await query.insertQuery("tbl_services", insertData);
            // console.log("Inserted Service Data: ", data);
            if (!data.insertId) {
                return middleware.sendApiResponse(res, Codes.SUCCESS, Codes.RESPONSE_ERROR, "SERVICE_CREATION_FAILED", null);
            }

            if (working_hours && working_hours.length > 0) {
                const workingHoursData = working_hours.map(wh => [
                    data.insertId,
                    wh.day,
                    wh.start_time,
                    wh.end_time
                ]);

                await db.query(
                    'INSERT INTO tbl_business_working_hours (service_id, day_of_week, start_time, end_time) VALUES ?',
                    [workingHoursData]
                );
            }
         
            let service_id = data.insertId;

            return middleware.sendApiResponse(res, Codes.SUCCESS, Codes.RESPONSE_SUCCESS, "SERVICE_CREATED_SUCCESSFULLY",  service_id );
            // // validate skills if provided
        } catch (error) {
            console.error("Error in createService:", error);
            return middleware.sendApiResponse(res, Codes.INTERNAL_ERROR, Codes.RESPONSE_ERROR, "INTERNAL_ERROR", null);
        }
    },

    async updateService(req, res) {
        try {

            const { service_name, description, duration_minutes, price, working_hours , service_id } = req.body;
            const adminId = req.loginUser?.id;
       
            
            if(service_id){
                await db.query(
                    `DELETE FROM tbl_business_working_hours WHERE service_id = ?`,
                    [service_id]
                );
            }

            // check if service exists and belongs to admin
            const [service] = await db.query(
                `SELECT id FROM tbl_services WHERE id = ? AND admin_id = ? AND is_active = 1 AND is_delete = 0`,
                [service_id, adminId]
            );
            console.log("Service to update: ", service);
            if (service.length === 0) {
                return middleware.sendApiResponse(res, Codes.SUCCESS, Codes.RESPONSE_ERROR, "SERVICE_NOT_FOUND_OR_UNAUTHORIZED", null);
            }

           const result =   await query.updateQuery(
                    "tbl_services",
                    {
                        service_name,
                        description,
                        duration_minutes,
                        price
                    },
                    "id = ?",
                    [service_id]
                );

            if (result[0].affectedRows === 0) {
                return middleware.sendApiResponse(res, Codes.SUCCESS, Codes.RESPONSE_ERROR, "SERVICE_UPDATE_FAILED", null);
            }
           
           
            if (working_hours && working_hours.length > 0) {
                const workingHoursData = working_hours.map(wh => [
                    service_id,
                    wh.day,
                    wh.start_time,
                    wh.end_time
                ]);
                const workingHoursResult = await db.query(
                    'INSERT INTO tbl_business_working_hours (service_id, day_of_week, start_time, end_time) VALUES ?',
                    [workingHoursData]
                );
                
                console.log("Working hours update result: ", workingHoursResult);
                if (!workingHoursResult[0].affectedRows) {
                    return middleware.sendApiResponse(res, Codes.SUCCESS, Codes.RESPONSE_ERROR, "WORKING_HOURS_UPDATE_FAILED", null);
                }
            }

            return middleware.sendApiResponse(res, Codes.SUCCESS, Codes.RESPONSE_SUCCESS, "SERVICE_UPDATED_SUCCESSFULLY", null);
        }catch (error) {
            console.error("Error in updateService:", error);
            return middleware.sendApiResponse(res, Codes.INTERNAL_ERROR, Codes.RESPONSE_ERROR, "INTERNAL_ERROR", null);
        }
         
    },

    async listServices(req, res) {
        try {
            const adminId = req.loginUser?.id;
            const { page = 1, limit = 5 } = req.query;
            const offset = (page - 1) * limit;

            const [[{ total }]] = await db.query(
                `SELECT COUNT(*) as total FROM tbl_services WHERE admin_id = ? AND is_active = 1 AND is_delete = 0`,
                [adminId]
            );

            const [services] = await db.query(
                `SELECT s.id, s.service_name, s.description, s.duration_minutes, s.price
                FROM tbl_services s
                WHERE s.admin_id = ? AND s.is_active = 1 AND s.is_delete = 0
                ORDER BY s.created_at DESC
                LIMIT ? OFFSET ?`,
                [adminId, Number(limit), Number(offset)]
            );
            const [workingHours] = await db.query(
                `SELECT service_id, day_of_week , start_time, end_time FROM tbl_business_working_hours WHERE service_id IN (SELECT id FROM tbl_services WHERE admin_id = ? AND is_active = 1 AND is_delete = 0)`,
                [adminId]
            );

            const servicesWithWorkingHours = services.map(service => {
                const hours = workingHours.filter(wh => wh.service_id === service.id);
                return {
                    ...service,
                    working_hours: hours.map(h => ({
                        day: h.day_of_week,
                        start_time: h.start_time,
                        end_time: h.end_time
                    }))
                };
            });
            return middleware.sendApiResponse(res, Codes.SUCCESS, Codes.RESPONSE_SUCCESS, "SERVICES_LIST_RETRIEVED_SUCCESSFULLY", {
                servicesWithWorkingHours, 
                pagination: { 
                    current_page: Number(page), 
                    per_page: Number(limit),
                    total: total,
                    totalPages: Math.ceil(total / Number(limit))
                }
            });
        } catch (error) {
            console.error("Error in listServices:", error);
            return middleware.sendApiResponse(res, Codes.INTERNAL_ERROR, Codes.RESPONSE_ERROR, "INTERNAL_ERROR", null);
        }
    },
    async manageWorkingHours(req ,res){
        try{

            const {service_id } = req.body;
            const adminId = req.loginUser?.id;

            // check if service exists and belongs to admin
            const [service] = await db.query(
                `SELECT s.id , w.is_open FROM tbl_services s LEFT JOIN tbl_business_working_hours w ON s.id = w.service_id WHERE s.id = ? AND s.admin_id = ? AND s.is_active = 1 AND s.is_delete = 0`,
                [service_id, adminId]
            );

            if (service.length === 0) {
                return middleware.sendApiResponse(res, Codes.SUCCESS, Codes.RESPONSE_ERROR, "SERVICE_NOT_FOUND_OR_UNAUTHORIZED", null);
            }


            const is_open = service[0].is_open ? 0 : 1;
            
            const result = await query.updateQuery(
                "tbl_business_working_hours",
                {
                    is_open: is_open ? 1 : 0
                },
                "service_id = ?",
                [service_id]
            );

            if (result[0].affectedRows === 0) {
                return middleware.sendApiResponse(res, Codes.SUCCESS, Codes.RESPONSE_ERROR, "WORKING_HOURS_UPDATE_FAILED", null);
            }

            return middleware.sendApiResponse(res, Codes.SUCCESS, Codes.RESPONSE_SUCCESS, "WORKING_HOURS_UPDATED_SUCCESSFULLY", null);
            
        }catch(error){
            console.error("Error in manageWorkingHours:", error);
            return middleware.sendApiResponse(res, Codes.INTERNAL_ERROR, Codes.RESPONSE_ERROR, "INTERNAL_ERROR", null);
        }
    },
    
    async dashboard(req, res) {
        try{
            const adminId = req.loginUser?.id;

            //upcoming appointments
            const upcomingAppointments = await db.query(
                `SELECT COUNT(*) AS total_upcoming_appointments FROM tbl_appointments a JOIN tbl_services s ON a.service_id = s.id WHERE s.admin_id = ? AND a.end_time >= NOW() AND a.appointment_date >= CURDATE() AND a.is_active = 1 AND a.is_delete = 0`,
                [adminId]
            );
            const upcomingAppointmentsData = upcomingAppointments[0][0].total_upcoming_appointments;
                // console.log(upcomingAppointmentsData)
            // total services
            const totalServicesResult = await db.query(
                `SELECT COUNT(*) AS total_services FROM tbl_services WHERE admin_id = ? AND is_active = 1 AND is_delete = 0`,
                [adminId]
            );
            const totalServices = totalServicesResult[0][0].total_services;

            // total appointments
            const totalAppointmentsResult = await db.query(
                `SELECT COUNT(*) AS total_appointments FROM tbl_appointments a JOIN tbl_services s ON a.service_id = s.id WHERE s.admin_id = ? AND a.is_active = 1 AND a.is_delete = 0`,
                [adminId]
            );
            const totalAppointments = totalAppointmentsResult[0][0].total_appointments;
            
            const pastAppointmentsResult = await db.query(
                `SELECT COUNT(*) AS total_past_appointments FROM tbl_appointments a JOIN tbl_services s ON a.service_id = s.id WHERE s.admin_id = ? AND a.end_time <= NOW() AND a.appointment_date <= CURDATE() AND a.is_active = 1 AND a.is_delete = 0`,
                [adminId]
            );
            const totalPastAppointments = pastAppointmentsResult[0][0].total_past_appointments;

             const dashboardData = {
                upcomingAppointmentsData,
                totalServices,
                totalAppointments,
                totalPastAppointments
            };

            return middleware.sendApiResponse(res, Codes.SUCCESS, Codes.RESPONSE_SUCCESS, "DASHBOARD_DATA_RETRIEVED_SUCCESSFULLY", dashboardData);

        }catch(error){
            console.error("Error in dashboard:", error);
            return middleware.sendApiResponse(res, Codes.INTERNAL_ERROR, Codes.RESPONSE_ERROR, "INTERNAL_ERROR", null);
        }
    },

    async listAppointments(req, res) {
        try {
            const adminId = req.loginUser?.id;
            const { page = 1, limit = 10 } = req.query;
            const offset = (page - 1) * limit;

            const [appointments] = await db.query(
                `SELECT a.id,
                a.status,
                 date_format(a.appointment_date, '%Y-%m-%d') AS appointment_date,
                  date_format(a.start_time, '%H:%i') AS start_time, 
                  date_format(a.end_time, '%H:%i') AS end_time, 
                  s.service_name, a.user_name
                 FROM tbl_appointments a
                 JOIN tbl_services s ON a.service_id = s.id
                 WHERE s.admin_id = ? AND a.is_active = 1 AND a.is_delete = 0
                 ORDER BY a.appointment_date DESC, a.start_time 
                 LIMIT ? OFFSET ?`,
                [adminId, Number(limit), Number(offset)]
            );
            const finalData = {
                appointments,
                pagination: {
                    current_page: Number(page),
                    per_page: Number(limit),
                }
            }

            return middleware.sendApiResponse(res, Codes.SUCCESS, Codes.RESPONSE_SUCCESS, "APPOINTMENTS_LIST_RETRIEVED_SUCCESSFULLY", finalData );
        } catch (error) {
            console.error("Error in listAppointments:", error);
            return middleware.sendApiResponse(res, Codes.INTERNAL_ERROR, Codes.RESPONSE_ERROR, "INTERNAL_ERROR", null);
        }
    },

    async updateAppointmentStatus(req, res) {
        try {
            const { appointment_id, status } = req.body;
            const adminId = req.loginUser?.id;
            console.log("Updating appointment status: ", appointment_id, status);

            // check if appointment exists and belongs to admin
            const [appointment] = await db.query(
                `SELECT a.id,  a.user_name , a.user_email FROM tbl_appointments a JOIN tbl_services s ON a.service_id = s.id WHERE a.id = ? AND s.admin_id = ? AND a.is_active = 1 AND a.is_delete = 0`,
                [appointment_id, adminId]
            );

            if (appointment.length === 0) {
                return middleware.sendApiResponse(res, Codes.SUCCESS, Codes.RESPONSE_ERROR, "APPOINTMENT_NOT_FOUND_OR_UNAUTHORIZED", null);
            }

            const result = await query.updateQuery(
                "tbl_appointments",
                { status },
                "id = ?",
                [appointment_id]
            );

            if (result[0].affectedRows === 0) {
                return middleware.sendApiResponse(res, Codes.SUCCESS, Codes.RESPONSE_ERROR, "APPOINTMENT_STATUS_UPDATE_FAILED", appointment_id);
            }
    
            if(status === "completed"){
                await this.sendOtpByEmail(appointment[0].user_name, appointment[0].user_email)
            }
            return middleware.sendApiResponse(res, Codes.SUCCESS, Codes.RESPONSE_SUCCESS, "APPOINTMENT_STATUS_UPDATED_SUCCESSFULLY", appointment_id);
        } catch (error) {
            console.error("Error in updateAppointmentStatus:", error);
            return middleware.sendApiResponse(res, Codes.INTERNAL_ERROR, Codes.RESPONSE_ERROR, "INTERNAL_ERROR", null);
        }
    },


}
  
export default adminModule;