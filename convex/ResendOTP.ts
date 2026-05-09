import { Email } from "@convex-dev/auth/providers/Email";
import { Resend as ResendAPI } from "resend";
import { RandomReader, generateRandomString } from "@oslojs/crypto/random";


export const ResendOTP = Email({
  id: "resend-otp",
  apiKey: process.env.RESEND_API_KEY || process.env.BREVO_API_KEY || "dummy-key",
  maxAge: 60 * 15, // 15 minutes
  async generateVerificationToken() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  },
  async sendVerificationRequest({ identifier: email, provider, token }) {
    console.log(`[AUTH] Attempting to send OTP to ${email}`);
    
    const resendKey = process.env.RESEND_API_KEY;
    const brevoKey = process.env.BREVO_API_KEY;
    const sender = process.env.SENDER_EMAIL || "onboarding@resend.dev";

    // 1. Try RESEND if key exists
    if (resendKey && resendKey !== "dummy-key") {
      try {
        const resend = new ResendAPI(resendKey);
        const { error } = await resend.emails.send({
          from: sender,
          to: [email],
          subject: "Sign in to Skill2Earn X",
          html: `<div style="font-family: sans-serif; max-width: 400px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                  <h2 style="color: #333; text-align: center;">Skill2Earn X</h2>
                  <p style="font-size: 16px; color: #555; text-align: center;">Your verification code is:</p>
                  <div style="background: #f4f4f4; padding: 15px; border-radius: 8px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #000; margin: 20px 0;">
                    ${token}
                  </div>
                </div>`
        });
        if (error) throw error;
        console.log(`[AUTH] OTP sent via Resend to ${email}`);
        return;
      } catch (err) {
        console.error("Resend delivery failed:", err);
      }
    }

    // 2. Try BREVO if key exists
    if (brevoKey && brevoKey !== "dummy-key") {
      try {
        const response = await fetch("https://api.brevo.com/v3/smtp/email", {
          method: "POST",
          headers: {
            "accept": "application/json",
            "api-key": brevoKey,
            "content-type": "application/json"
          },
          body: JSON.stringify({
            sender: { name: "Skill2Earn X", email: sender },
            to: [{ email: email }],
            subject: "Sign in to Skill2Earn X",
            htmlContent: `<div style="font-family: sans-serif; max-width: 400px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                            <h2 style="color: #333; text-align: center;">Skill2Earn X</h2>
                            <p style="font-size: 16px; color: #555; text-align: center;">Your verification code is:</p>
                            <div style="background: #f4f4f4; padding: 15px; border-radius: 8px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #000; margin: 20px 0;">
                              ${token}
                            </div>
                          </div>`
          })
        });
        if (response.ok) {
          console.log(`[AUTH] OTP sent via Brevo to ${email}`);
          return;
        }
        console.error("Brevo delivery failed status:", response.status);
      } catch (err) {
        console.error("Brevo fetch error:", err);
      }
    }

    // 3. Fallback to Console Logging (for Dev/Local)
    console.log(`\n\n======================================================`);
    console.log(`🔐 SKILL2EARN OTP CODE FOR ${email}: ${token}`);
    console.log(`======================================================\n\n`);
  },
});
