import userModule from "../module/user-module.js";

const userController = {

    async getServiceList(req, res) {
        return userModule.getServiceList(req, res);
    },

    async getAvailableSlots(req, res) {
        return userModule.getAvailableSlots(req, res);
    },

    async bookAppointment(req, res) {
        return userModule.bookAppointment(req, res);
    },

    async serviceDetails(req , res){
        return userModule.serviceDetails(req , res)
    }
    
}
 
export default userController;