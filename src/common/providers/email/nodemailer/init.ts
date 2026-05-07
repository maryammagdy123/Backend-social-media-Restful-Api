import { SMTP_PASSWORD_KEY, SMTP_PORT, SMTP_USER } from "../../../../config";
import { NodeMailerProvider } from "./nodemailer.service";
export const nodemailerProvider = new NodeMailerProvider({
  service: "gmail",
  host: "smtp.gmail.com",
  port: SMTP_PORT as unknown as number,
  secure: false,
  auth: {
    user: SMTP_USER as string,
    pass: SMTP_PASSWORD_KEY as string,
  },
});
