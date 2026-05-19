import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
export async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
	console.log("Attempting to send email to:", to);
	console.log("Using EMAIL_USER:", process.env.EMAIL_USER ? "Present" : "MISSING");
	console.log("Using EMAIL_PASS:", process.env.EMAIL_PASS ? "Present" : "MISSING");
	if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
		throw new Error("Missing email credentials in environment variables");
	}
	console.log("Creating nodemailer transporter for host: smtp.gmail.com");
	const transporter = nodemailer.createTransport({
		host: "smtp.gmail.com",
		port: 465,
		secure: true, 
		auth: {
			user: process.env.EMAIL_USER,
			pass: process.env.EMAIL_PASS,
		},
		debug: true, 
		logger: true, 
	});

	console.log("Transporter created. Sending mail...");
	const info = await transporter.sendMail({
		from: `"Email Builder" <${process.env.EMAIL_USER}>`,
		to,
		subject,
		html,
	});
	console.log("Email sent successfully. Message ID:", info.messageId);
	return info;
}
