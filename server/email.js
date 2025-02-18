import nodemailer from "nodemailer";
import 'dotenv/config';

export default async function SendMailToUser(email, verificationcode) {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: 'prodculterr@gmail.com',
            pass: process.env.EMAIL_GENERATED_PASSWORD,
        },
    });

    await transporter.sendMail({
        from: '"myProfile_app" <prodculterr@gmail.com>',
        to: email,
        subject: "Verify Your Email",
        html: `<h2>Copy & paste the passcode below to verify your email</h2><p>Passcode: ${verificationcode}</p>`
    });
}