const nodemailer = require("nodemailer");

const { SENDER_EMAIL_ADDRESS, SENDER_EMAIL_PASSWORD } = process.env;
// send mail
const sendEmail = (to, subject, html, cb) => {
    const smtpTransport = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: SENDER_EMAIL_ADDRESS,
            pass: SENDER_EMAIL_PASSWORD,
        },
    });

    const mailOptions = {
        from: SENDER_EMAIL_ADDRESS,
        to,
        subject,
        html,
    };

    smtpTransport.sendMail(mailOptions, cb);
};

module.exports = sendEmail;
