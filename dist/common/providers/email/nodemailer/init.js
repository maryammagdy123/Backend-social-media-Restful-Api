"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nodemailerProvider = void 0;
const config_1 = require("../../../../config");
const nodemailer_service_1 = require("./nodemailer.service");
exports.nodemailerProvider = new nodemailer_service_1.NodeMailerProvider({
    service: "gmail",
    host: "smtp.gmail.com",
    port: config_1.SMTP_PORT,
    secure: false,
    auth: {
        user: config_1.SMTP_USER,
        pass: config_1.SMTP_PASSWORD_KEY,
    },
});
