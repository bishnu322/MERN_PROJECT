"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = exports.transporter = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const error_handler_middleware_1 = require("../middlewares/error-handler.middleware");
exports.transporter = nodemailer_1.default.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: Number(process.env.SMTP_PORT) === 465 ? true : false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});
const sendEmail = (_a) => __awaiter(void 0, [_a], void 0, function* ({ to, subject, html, cc = null, bcc = null, attachment = null, }) {
    try {
        let message = {
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
        yield exports.transporter.sendMail(message);
    }
    catch (error) {
        throw new error_handler_middleware_1.CustomError(`sending email error ${error}`, 400);
    }
});
exports.sendEmail = sendEmail;
