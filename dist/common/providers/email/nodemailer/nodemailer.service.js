"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeMailerProvider = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
class NodeMailerProvider {
    transporter;
    constructor(config) {
        this.transporter = nodemailer_1.default.createTransport({
            service: config.service,
            host: config.host,
            port: config.port,
            secure: config.secure,
            auth: {
                user: config.auth.user,
                pass: config.auth.pass,
            },
        });
    }
    async send(to, subject, body) {
        await this.transporter.sendMail({
            to,
            subject,
            text: body,
            from: '"Social Media App" <no-reply@social.com>',
        });
    }
}
exports.NodeMailerProvider = NodeMailerProvider;
