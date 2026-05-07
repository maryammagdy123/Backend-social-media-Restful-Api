import nodemailer, { createTransport, Transporter } from "nodemailer";
import { IEmailProvider } from "../email.interface";
interface NodemailerConfig {
  service: string;
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

export class NodeMailerProvider implements IEmailProvider {
  private transporter: Transporter;

  constructor(config: NodemailerConfig) {
    this.transporter = nodemailer.createTransport({
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

  async send(to: string, subject: string, body: string): Promise<void> {
    await this.transporter.sendMail({
      to,
      subject,
      text: body,
      from: '"Social Media App" <no-reply@social.com>',
    });
  }
}
