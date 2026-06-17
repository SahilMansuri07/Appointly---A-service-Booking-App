import authModule from "../module/auth-module.js";

const authController = {

    async signUp(req, res) {
        return authModule.signUp(req, res);
    },

    async login(req, res) {
        return authModule.login(req, res);
    },

    async getProfile(req, res) {
        return authModule.getProfile(req, res);
    },

    async editProfile(req, res) {
        return authModule.editProfile(req, res);
    },

    async changePassword(req, res) {
        return authModule.changePassword(req, res);
    },

    async changeLanguage(req, res) {
        return authModule.changeLanguage(req, res);
    },

    async logout(req, res) {
        return authModule.logout(req, res);
    },

}

export default authController;