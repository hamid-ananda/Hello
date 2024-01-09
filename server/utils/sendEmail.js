const nodemailer = require("nodemailer");

const sendEmail = async (email, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.HOST, // SMTP server host
            service: process.env.SERVICE, // Email service provider
            port: 587, // SMTP port
            secure: true, // Use SSL
            auth: {
                user: process.env.USER, // Email account username
                pass: process.env.PASS, // Email account password
            },
        });

        await transporter.sendMail({
            from: process.env.USER, // Sender email address
            to: email, // Recipient email address
            subject: subject, // Email subject
            text: text, // Email body
        });

        console.log("email sent sucessfully");
    } catch (error) {
        console.log(error, "email not sent");
    }
};

module.exports = sendEmail;
