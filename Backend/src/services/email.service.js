import nodemailer from "nodemailer";
import { buildOtpEmailHtml } from "../templates/otpEmail.js";
import { buildBuyerOrderEmailHtml } from "../templates/orderBuyerEmail.js";
import { buildSellerOrderEmailHtml } from "../templates/orderSellerEmail.js";

const isEmailConfigured = () =>
  Boolean(
    process.env.SMTP_HOST &&
      process.env.SMTP_USER &&
      (process.env.SMTP_PASS || "").replace(/\s/g, "")
  );

export const getEmailConfigStatus = () => ({
  configured: isEmailConfigured(),
});

let transporter = null;

const getSmtpPass = () => (process.env.SMTP_PASS || "").replace(/\s/g, "");

const getFromAddress = () =>
  process.env.EMAIL_FROM ||
  process.env.SMTP_FROM ||
  "Krishik Bazar <noreply@krishikbazar.com>";

const getTransporter = () => {
  if (!isEmailConfigured()) return null;
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: getSmtpPass(),
      },
    });
  }
  return transporter;
};

export const sendEmail = async ({ to, subject, html, devOtp }) => {
  const transport = getTransporter();

  if (!transport) {
    console.log("\n========== [Email DEV — SMTP not configured] ==========");
    console.log(`To:      ${to}`);
    console.log(`Subject: ${subject}`);
    if (devOtp) {
      console.log(`OTP:     ${devOtp}`);
    }
    console.log("Add SMTP_HOST, SMTP_USER, SMTP_PASS to Backend/.env to send real emails.");
    console.log("=====================================================\n");
    return { dev: true };
  }

  try {
    await transport.sendMail({
      from: getFromAddress(),
      to,
      subject,
      html,
    });
    return { dev: false };
  } catch (error) {
    console.error("[Email] Failed to send:", error.message);
    throw new Error(`Could not send email: ${error.message}`);
  }
};

export const sendOtpEmail = async (email, otp) => {
  return sendEmail({
    to: email,
    subject: "Your Krishik Bazar verification code",
    html: buildOtpEmailHtml(otp),
    devOtp: otp,
  });
};

export const sendBuyerOrderEmail = async (order, buyer) => {
  if (!buyer?.email) return;

  const orderId = String(order._id).slice(-8).toUpperCase();
  await sendEmail({
    to: buyer.email,
    subject: `Order confirmed — #${orderId} | Krishik Bazar`,
    html: buildBuyerOrderEmailHtml(order, buyer),
  });
};

export const sendSellerOrderEmail = async (order, seller, sellerItems) => {
  if (!seller?.email) return;

  const orderId = String(order._id).slice(-8).toUpperCase();
  await sendEmail({
    to: seller.email,
    subject: `New order #${orderId} — items to fulfill | Krishik Bazar`,
    html: buildSellerOrderEmailHtml(order, seller, sellerItems),
  });
};
