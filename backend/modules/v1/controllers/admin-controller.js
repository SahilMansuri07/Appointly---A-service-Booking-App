import adminModule from "../module/admin-module.js";

const adminController = {

    async createService(req, res) {
        return adminModule.createService(req, res);
    },

    async updateService(req, res) {
        return adminModule.updateService(req, res);
    },

    async manageWorkingHours(req, res) {
        return adminModule.manageWorkingHours(req, res);
    },
  
    async dashboard(req, res) {
        return adminModule.dashboard(req, res);
    },

    async listAppointments(req, res) {
        return adminModule.listAppointments(req, res);
    },

    async updateAppointmentStatus(req, res) {
        return adminModule.updateAppointmentStatus(req, res);
    },

    async listServices(req, res) {
        return adminModule.listServices(req, res);
    }
}

export default adminController;