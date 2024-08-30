"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer = __importStar(require("nodemailer"));
function send_emails(email, code) {
    var msg = "";
    msg += "<p>Hey,</p>";
    msg += "<p>lower you can find your authentication code.</p>";
    msg += "<p>Please do not answer to this email.</p>";
    msg += "<p>This email was created automatically.</p>";
    msg += "<H3>Your authentication code</H3>";
    msg += "<p>Authentication code: " + code + "</p>";
    var transporter = nodemailer.createTransport({
        host: 'smtp.seznam.cz',
        port: 465,
        secure: true,
        auth: {
            user: 'test2584884@seznam.cz',
            pass: 'test.test1'
        }
    });
    var mailOptions = {
        from: 'test2584884@seznam.cz',
        to: email,
        subject: 'Your authentication code',
        html: msg
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        }
        else {
            console.log('Email sent: ' + info.response);
        }
    });
}
exports.default = send_emails;
