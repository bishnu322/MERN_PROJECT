import nodemailer from "nodemailer";
import { CustomError } from "../middlewares/error-handler.middleware";

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: Number(process.env.SMTP_PORT) === 465 ? true : false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

type Mailing = {
  to: string;
  subject: string;
  html: string;
  cc?: string[] | string | null;
  bcc?: string[] | string | null;
  attachment?: [] | null;
};

export const sendEmail = async ({
  to,
  subject,
  html,
  cc = null,
  bcc = null,
  attachment = null,
}: Mailing) => {
  try {
    let message: Record<string, any> = {
      from: `MERN SHOPPING CENTER <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    };

    if (cc) {
      message["cc"] = cc;
    }

    if (bcc) {
      message["bcc"] = bcc;
    }

    if (attachment) {
      message["attachment"] = attachment;
    }

    await transporter.sendMail(message);
  } catch (error) {
    throw new CustomError(`sending email error ${error}`, 400);
  }
};
