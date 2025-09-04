import nodemailer, { Transporter } from "nodemailer";
import { convert } from "html-to-text";

import { EMAIL_SUBJECTS, EMAIL_BODIES } from "../constants/emails";

interface SendEmailProps {
  to: string;
  subject: string;
  html: string;
}

class EmailService {
  private transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST as string,
      port: parseInt(process.env.SMTP_PORT || "587", 10),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER as string,
        pass: process.env.SMTP_PASS as string,
      },
      tls: { rejectUnauthorized: false },
    });
  }

  // Sending an email
  async sendEmail({ to, subject, html }: SendEmailProps): Promise<void> {
    try {
      const text: string = convert(html);

      const info = await this.transporter.sendMail({
        from: process.env.SMTP_USER as string,
        to,
        subject,
        text,
        html,
      });
      console.log(`✅ Email sent successfully: ${info.messageId}`);
    } catch (error) {
      console.error("❌ Error sending email:", error);
      throw error;
    }
  }

  //01 Sending a Welcome email
  async sendWelcomeEmail(to: string, name: string): Promise<void> {
    const subject = EMAIL_SUBJECTS.WELCOME;
    const html = EMAIL_BODIES.WELCOME(name);
    await this.sendEmail({ to, subject, html });
  }

  // Reset password link
  async resetPasswordEmail(
    to: string,
    name: string,
    link: string
  ): Promise<void> {
    const subject = EMAIL_SUBJECTS.PASSWORD_RESET;
    const html = EMAIL_BODIES.PASSWORD_RESET(name, link);
    await this.sendEmail({ to, subject, html });
  }
  async resetPasswordSuccessEmail(to: string, name: string): Promise<void> {
    const subject = EMAIL_SUBJECTS.PASSWORD_RESET_SUCCESS;
    const html = EMAIL_BODIES.PASSWORD_RESET_SUCCESS(name);
    await this.sendEmail({ to, subject, html });
  }
  async verificationEmail(
    to: string,
    name: string,
    link: string
  ): Promise<void> {
    const subject = EMAIL_SUBJECTS.VERIFY_EMAIL;
    const html = EMAIL_BODIES.VERIFY_EMAIL(name, link);
    await this.sendEmail({ to, subject, html });
  }

  // 5. Account deletion confirmation
  async accountDeletedEmail(to: string, name: string): Promise<void> {
    const subject = EMAIL_SUBJECTS.ACCOUNT_DELETED;
    const html = EMAIL_BODIES.ACCOUNT_DELETED(name);
    await this.sendEmail({ to, subject, html });
  }
}

export default EmailService;
