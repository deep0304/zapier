import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: 587,
  secure: false, // upgrade later with STARTTLS
  auth: {
    user: process.env.SMTP_USER_BREVO,
    pass: process.env.SMTP_KEY_BREVO,
  },
});

export async function sendEmail(to: string, body: string) {
  //send the email to the bounty solver
  await transporter.sendMail({
    from: "aesthetiicmusic@gmail.com",
    sender: "aesthetiicmusic@gmail.com",
    to: to,
    subject: "HEllo from the zapier",
    text: body,
  });
}
