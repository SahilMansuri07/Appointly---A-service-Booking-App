import jwt from "jsonwebtoken";
import db from "./db.js";
import query from "./dbHelper.js";
import nodemailer from "nodemailer";
import multer  from "multer";
import path from "path";
import fs from "fs";
import { profile } from "console";

const common = {
   async checkUniqueEmail(request) {
    try {
        const sql = "SELECT id, email FROM tbl_user WHERE email = ? AND is_delete = 0 LIMIT 1";
        const [rows] = await db.query(sql, [request.email]);  // ✅ destructure
        return rows && rows.length > 0 ? rows[0] : null;
    } catch (error) {
        console.error("Error checking unique email: ", error);
        throw error;
    }
},

async checkUniqueMobileNumber(request) {
    try {
        const sql = "SELECT id, mobile_number FROM tbl_user WHERE country_code = ? AND mobile_number = ? AND is_delete = 0 LIMIT 1";
        const [rows] = await db.query(sql, [request.country_code, request.mobile_number]);  // ✅
        return rows && rows.length > 0 ? rows[0] : null;
    } catch (error) {
        console.error("Error checking unique mobile number: ", error);
        throw error;
    }
},

async checkSocialId(request) {
    try {
        const sql = "SELECT id, social_id FROM tbl_user WHERE social_id = ? AND is_delete = 0 LIMIT 1";
        const [rows] = await db.query(sql, [request.social_id]);  // ✅
        return rows && rows.length > 0 ? rows[0] : null;
    } catch (error) {
        console.error("Error checking unique social ID: ", error);
        throw error;
    }
},

    async validateIdExists(tableName, id) {
        try {
            const sql = `SELECT id FROM ${tableName} WHERE id = ? AND is_active = 1 AND is_delete = 0 LIMIT 1`;
            const result = await db.query(sql, [id]);
            return result && result.length > 0;
        } catch (error) {
            console.error("Error validating ID exists: ", error);
            return false;
        }
    },

    async getUserDetails(request) { 
        try {
            let sql = "SELECT * FROM tbl_user WHERE  is_delete = 0";
            const params = [];

            if (request.role) {
                sql += " AND role = ?";
                params.push(request.role);
            }
            
            if (request?.id) {
                sql += " AND id = ? LIMIT 1";
                params.push(request.id);
            } else {
                sql += " ORDER BY id DESC";
            }

            const result = await db.query(sql, params);
            return request?.id ? (result && result.length > 0 ? result[0] : null) : (result || []);
        } catch (error) {
            console.error("Error fetching user details: ", error);
            return null;
        }
    },

    generateToken: async function (user , request) {
        try {
            const normalizedUser = Array.isArray(user) ? user[0] : user;
            // console.log("Normalized User for Token Generation: ", normalizedUser);
            if (!normalizedUser || !normalizedUser.id) {
                throw new Error("Invalid user data for token generation");
            }
            console.log(request?.body || request || {});

            const payload = {
                id: normalizedUser.id,
                role: "admin"
            };
            
            const requestBody = request?.body || request || {};
            const { device_token, device_type, device_name, device_model, os_version, uuid, ip } = requestBody;
                console.log(payload)
            const user_id = normalizedUser.id;
            const token = jwt.sign(payload, process.env.JWT_WEB_TOKEN, { expiresIn: "365d" });
           
            const devicePayload = {
                user_id : user_id,
                token : token || null,
                device_token: device_token || null, 
                device_type: device_type || null,
                device_name: device_name || null,
                device_model: device_model || null,
                os_version: os_version || null,
                uuid: uuid || null,
                ip: ip || null,
                is_active: 1,
                is_delete: 0,
            };
           
                // Check if device already exists
                const checkSql = "SELECT id FROM tbl_user_device WHERE user_id = ? AND is_active = 1 AND is_delete = 0 LIMIT 1";
                const [deviceExists] = await db.query(checkSql, [user_id]);

                if (deviceExists && deviceExists.length > 0) {

                    // await query.updateQuery(
                    //     "tbl_user_device",
                    //     "token = ?, device_token = ?, device_type = ?, device_name = ?, device_model = ?, os_version = ?, ip = ?",
                    //     "user_id = ? AND uuid = ?",
                    //     [null, device_token || null, device_type || null, device_name || null, device_model || null, os_version || null, ip || null, user_id, uuid]
                    // );

                    // Update existing device
                    await query.updateQuery(
                        "tbl_user_device",
                        "token = ?, device_token = ?, device_type = ?, device_name = ?, device_model = ?, os_version = ?, ip = ?",
                        "user_id = ?",
                        [token, device_token || null, device_type || null, device_name || null, device_model || null, os_version || null, ip || null, user_id]
                    );
                } else {
                    // Create new device
                    await query.insertQuery("tbl_user_device", devicePayload);
                }

            return token;

        } catch (error) {
            console.log(error);
            throw error;
        }
    },

    
    sendNotification : async function(sender_id, receiver_id, title, description) {
        try {
            const consoleparsedReceiverId = receiver_id == null ? null : Number(receiver_id);
            // console.log("Parsed Receiver ID:", consoleparsedReceiverId);
            // console.log("Original Receiver ID:", receiver_id);
            const notificationInsert = {
                sender_id: sender_id ?? null,
                receiver_id: consoleparsedReceiverId,
                title: title ?? null,
                description: description ?? null,
                is_active: 1,
                is_delete: 0
            }
           
            await query.insertQuery("tbl_notification", notificationInsert);
        } catch (error) {
            console.error("Error sending notification: ", error);
        }
    },

    async sendConfirmationMail({ toEmail, subject, htmlMessage }) {
 
        if (!toEmail || !subject || !htmlMessage) {
        return { skipped: true, reason: "Missing toEmail/subject/htmlMessage" };
        }
   
        const smtpUser = process.env.SMTP_USER;
        const smtpPass = process.env.SMTP_PASS || process.env.SMTP_PASSWORD;
        const mailFrom = process.env.MAIL_FROM || smtpUser;
    
        if (!mailFrom || !smtpUser || !smtpPass) {
        return { skipped: true, reason: "Mail env is not configured" };
        }
    
        const smtpHost =
        process.env.SMTP_HOST && process.env.SMTP_HOST !== "smtp.example.com"
            ? process.env.SMTP_HOST
            : "smtp.gmail.com";
    
        const transporter = nodemailer.createTransport({
        service: "gmail",
        host: smtpHost,
        port: Number(process.env.SMTP_PORT || 587),
        secure: false,
        auth: {
            user: smtpUser,
            pass: smtpPass,
        },
        });
    
        const info = await transporter.sendMail({
        from: mailFrom,
        to: toEmail,
        subject,
        html: htmlMessage,
        });
    
        return { skipped: false, messageId: info.messageId };
    },


     async generateTimeSlots(startTime, endTime, slotDuration) {
    const slots = [];
    let start = new Date(`1970-01-01T${startTime}`);
    const end = new Date(`1970-01-01T${endTime}`);
 
    while (start < end) {
      const formattedStart = start.toTimeString().slice(0, 5);
 
      let nextSlot = new Date(start.getTime() + slotDuration * 60000);
      const formattedEnd = nextSlot.toTimeString().slice(0, 5);
 
      if (nextSlot > end) break;
 
      slots.push({ start: formattedStart, end: formattedEnd });
      start = nextSlot;
    }
 
    return slots;
  },
}

export default common;