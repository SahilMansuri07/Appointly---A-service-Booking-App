import common from "../../../config/common.js";
import db from "../../../config/db.js";
import query from "../../../config/dbHelper.js";
import Codes from "../../../config/status_codes.js";
import bcrypt from "bcrypt";
import middleware from "../../../middleware/middleware.js";

const helper = {

    async validateUserFields({ email, username, country_code, mobile_number }) {
        
        if(email) {
            const emailExists = await common.checkUniqueEmail({ email });
            if (emailExists) return "EMAIL_ALREADY_EXISTS"
        }

        if(username) {
            const usernameExists = await common.checkUsernameExists({ username });
            // console.log("Username exists: ", usernameExists);
            if (usernameExists) {
                return "USERNAME_ALREADY_EXISTS";
            }
        }

        if(country_code && mobile_number) {
            const mobileExists = await common.checkUniqueMobileNumber({ country_code, mobile_number });
            // console.log("Mobile number exists: ", mobileExists);
            if (mobileExists) {
                return "MOBILE_NUMBER_ALREADY_EXISTS";
            }
        }
        return null;
    },             

}
const authModule = {

    async signUp(request , res) {
        try {
            const hashedPassword = await bcrypt.hash(request.body.password, 10);
            const userReg = {
                name : request.body.name,
                email: request.body.email,
                country_code: request.body.country_code,
                mobile_number: request.body.mobile_number,
                password: hashedPassword,
            };
            
           const userValidationError = await helper.validateUserFields({ email : userReg.email , country_code: userReg.country_code, mobile_number: userReg.mobile_number });
            if (userValidationError) {
                return middleware.sendApiResponse(
                    res,
                    Codes.SUCCESS,
                    Codes.RESPONSE_ERROR,
                    userValidationError,
                    null
                );
            }

            const [result] = await query.insertQuery( "tbl_user" ,userReg );
            
            //  console.log("User registration result: ", result);

            const [registeredUser] = await common.getUserDetails({ id: result.insertId });
            // console.log("Registered user details: ", registeredUser);
            const token = await common.generateToken({ id: result.insertId, role: "user" } , request);
            const userResponse = {
                user: registeredUser,
                token: token
            };
            return middleware.sendApiResponse(
                res,
                Codes.SUCCESS,
                Codes.RESPONSE_SUCCESS,
                "USER_REGISTERED_SUCCESSFULLY",
                userResponse
            );

        } catch (error) {
            console.log("Error in authModule.signup:", error);
            return middleware.sendApiResponse(
                res,
                Codes.INTERNAL_ERROR,
                Codes.RESPONSE_ERROR,
                "INTERNAL_ERROR",
                null
            );
        }
    },

    async login(req, res) {
        try {
            const { email  , country_code, mobile_number, password } = req.body;
            // console.log("Login request received: ", { email, country_code, mobile_number , password });
            let whereClause = "is_active = 1 AND is_delete = 0 ";
            const params = [];
            if (email) {
                whereClause += "AND email = ?";
                params.push(email);
            } 
         
            if (country_code && mobile_number) {
                whereClause += "AND country_code = ? AND mobile_number = ?";
                params.push(country_code, mobile_number);
            }
            const [userRows] = await db.query(
                `SELECT id, password FROM tbl_user WHERE ${whereClause} LIMIT 1`,
                params
            );
            if (userRows.length === 0) {
                return middleware.sendApiResponse(
                    res,
                    Codes.SUCCESS,
                    Codes.RESPONSE_ERROR,
                    "USER_NOT_FOUND_WITH_PROVIDED_DETAILS",
                    null
                );
            }
            
            const user = userRows[0];


            const [userDetails] = await common.getUserDetails({ id: user.id });
            if (userDetails.is_active == 0 || userDetails.is_delete == 1) {
                return middleware.sendApiResponse(
                    res,
                    Codes.SUCCESS,
                    Codes.RESPONSE_ERROR,
                    "USER_ACCOUNT_IS_INACTIVE_OR_DELETED",
                    null
                );
            }

            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                return middleware.sendApiResponse(
                    res,
                    Codes.SUCCESS,
                    Codes.RESPONSE_ERROR,
                    "INVALID_PASSWORD",
                    null
                );
            }
            // console.log("User authenticated successfully: ", userDetails);
            const token = await common.generateToken({ id: user.id, role: userDetails.role } ,req);
            const [userData] = await common.getUserDetails({ id: user.id });
            
            return middleware.sendApiResponse(
                res,
                Codes.SUCCESS,
                Codes.RESPONSE_SUCCESS,
                "LOGIN_SUCCESSFUL",
                { userData , token }
            );

        } catch (error) {
            console.log("Error in authModule.login:", error);
            return middleware.sendApiResponse(
                res,
                Codes.INTERNAL_ERROR,
                Codes.RESPONSE_ERROR,
                "INTERNAL_ERROR",
                null
            );
        }
    },

    async editProfile(req , res){
        try {
            const { name ,  email, country_code, mobile_number  } = req.body;
            // console.log("Edit role: ", req.loginUser.role);
            // console.log("requested user " , req.loginUser);
            const userId = req.loginUser.id || req.loginUser?.id;
             const userData = await common.getUserDetails({ id: userId });
            if (!userData) {
                return middleware.sendApiResponse(
                    res,
                    Codes.SUCCESS,
                    Codes.RESPONSE_ERROR,
                    "USER_NOT_FOUND",
                    null
                );
            }
            // console.log("User data for profile edit: ", userData);
            // console.log("User data for profile email: ", email);
            if(userData[0].email !== email || (userData[0].country_code !== country_code && userData[0].mobile_number !== mobile_number)) {
           const userValidationError = await helper.validateUserFields({ email, name, country_code, mobile_number });
            if (userValidationError) {
                return middleware.sendApiResponse(
                    res,
                    Codes.SUCCESS,
                    Codes.RESPONSE_ERROR,
                    userValidationError,
                    null
                );
            }
        }
            
            const updateData = {
                name: name || userData[0].name,
                email: email || userData[0].email,
                country_code: country_code || userData[0].country_code,
                mobile_number: mobile_number || userData[0].mobile_number,
            };
                const updateResult = await query.updateQuery("tbl_user", updateData, "id = ?", [userId]);
            
            if (updateResult.affectedRows === 0) {
                return middleware.sendApiResponse(
                    res,
                    Codes.SUCCESS,
                    Codes.RESPONSE_ERROR,
                    "PROFILE_UPDATE_FAILED",
                    null
                );
            }

            const updatedUser = await common.getUserDetails({ id: userId });
            return middleware.sendApiResponse(
                res,
                Codes.SUCCESS,
                Codes.RESPONSE_SUCCESS,
                "PROFILE_UPDATED_SUCCESSFULLY",
                updatedUser
            );

        } catch (error) {
            console.log("Error in authModule.editProfile:", error);
            return middleware.sendApiResponse(
                res,
                Codes.INTERNAL_ERROR,
                Codes.RESPONSE_ERROR,
                "INTERNAL_ERROR",
                null
            );
        }
    },

      async changePassword(req, res) {
        try {
            const userId = req.loginUser?.id;
            const { old_password, new_password } = req.body;

            if (!userId || !old_password || !new_password) {
                return middleware.sendApiResponse(
                    res,
                    Codes.SUCCESS,
                    Codes.RESPONSE_ERROR,
                    "MISSING_REQUIRED_FIELDS",
                    null
                );
            }

            const userData = await common.getUserDetails({ id: userId });
            if (!userData) {
                return middleware.sendApiResponse(
                    res,
                    Codes.SUCCESS,
                    Codes.RESPONSE_ERROR,
                    "USER_NOT_FOUND_WITH_PROVIDED_DETAILS",
                    null
                );
            }
            // console.log("User data for password change: ", old_password, userData.password);
            // console.log(userData)
            const passwordMatch = await bcrypt.compare(old_password, userData[0].password || "");
            // console.log("Password match: ", passwordMatch);
            if (!passwordMatch) {
                return middleware.sendApiResponse(
                    res,
                    Codes.SUCCESS,
                    Codes.RESPONSE_ERROR,
                    "INVALID_PASSWORD",
                    null
                );
            }

            const samePassword = await bcrypt.compare(new_password, userData[0].password || "");
            if (samePassword) {
                return middleware.sendApiResponse(
                    res,
                    Codes.SUCCESS,
                    Codes.RESPONSE_ERROR,
                    "NEW_PASSWORD_MUST_BE_DIFFERENT",
                    null
                );
            }

            const hashedPassword = await bcrypt.hash(new_password, 10);
            const [updateResult] = await query.updateQuery(
                "tbl_user",
                { password: hashedPassword },
                "id = ? AND is_delete = 0",
                [userId]
            );

            if (!updateResult || updateResult.affectedRows === 0) {
                return middleware.sendApiResponse(
                    res,
                    Codes.SUCCESS,
                    Codes.RESPONSE_ERROR,
                    "PASSWORD_CHANGE_FAILED",
                    null
                );
            }

            return middleware.sendApiResponse(
                res,
                Codes.SUCCESS,
                Codes.RESPONSE_SUCCESS,
                "PASSWORD_CHANGED_SUCCESSFULLY",
                null
            );
        } catch (error) {
            console.log("Error in authModule.changePassword:", error);
            return middleware.sendApiResponse(
                res,
                Codes.INTERNAL_ERROR,
                Codes.RESPONSE_ERROR,
                "INTERNAL_ERROR",
                null
            );
        }
    },

    async getProfile(req, res) {
        try {
            const userId = req.loginUser?.id;

            if (!userId) {
                return middleware.sendApiResponse(
                    res,
                    Codes.SUCCESS,
                    Codes.RESPONSE_ERROR,
                    "MISSING_USER_ID",
                    null
                );
            }

            const userData = await common.getUserDetails({ id: userId });
            if (!userData) {
                return middleware.sendApiResponse(
                    res,
                    Codes.SUCCESS,
                    Codes.RESPONSE_ERROR,
                    "USER_NOT_FOUND",
                    null
                );
            }

            return middleware.sendApiResponse(
                res,
                Codes.SUCCESS,
                Codes.RESPONSE_SUCCESS,
                "PROFILE_RETRIEVED_SUCCESSFULLY",
                userData
            );
        }catch (error) {
            console.log("Error in authModule.getProfile:", error);
            return middleware.sendApiResponse(
                res,
                Codes.INTERNAL_ERROR,
                Codes.RESPONSE_ERROR,
                "INTERNAL_ERROR",
                null
            );
        }
    },
    async logout(request, res) {
        try {
            const token = request.headers['token'];
            // console.log("Logout requested with token: ", token);

            const [result] = await query.updateQuery("tbl_user_device", { token: null }, "token = ?", [token]);


            if (!result || result.affectedRows === 0) {
                return middleware.sendApiResponse(
                    res,
                    Codes.SUCCESS,
                    Codes.RESPONSE_ERROR,
                    "rest_you_are_aleady_logged_out",
                    null,
                );
            }

            // For stateless JWT, logout can be handled on client side by deleting token
            return middleware.sendApiResponse(
                res,
                Codes.SUCCESS,
                Codes.RESPONSE_SUCCESS,
                "rest_logout_successful",
                null
            );
        } catch (error) {
            console.log("Error in logout: ", error);
            return middleware.sendApiResponse(
                res,
                Codes.INTERNAL_ERROR,
                Codes.RESPONSE_ERROR,
                "rest_keywords_error",
                null
            );
        }
    },
    
}
export default authModule;