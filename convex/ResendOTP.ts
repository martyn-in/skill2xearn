import { Email } from "@convex-dev/auth/providers/Email";
import { Resend as ResendAPI } from "resend";
import { RandomReader, generateRandomString } from "@oslojs/crypto/random";
 
export const ResendOTP = Email({
  id: "resend-otp",
  apiKey: process.env.RESEND_API_KEY,
  maxAge: 60 * 15, // 15 minutes
  async generateVerificationToken() {
    const random: RandomReader = {
      read(bytes) {
        crypto.getRandomValues(bytes);
      },
    };
 
    const alphabet = "0123456789";
    const length = 6; // Changed to 6 for standard OTP feel
    return generateRandomString(random, alphabet, length);
  },
  async sendVerificationRequest({ identifier: email, provider, token }) {
    const resend = new ResendAPI(provider.apiKey);
    const { error } = await resend.emails.send({
      from: "Skill2Earn X <noreply@skill2earn.com>",
      to: [email],
      subject: `Sign in to Skill2Earn X`,
      text: "Your verification code is " + token,
      html: `
        <div style="font-family: sans-serif; max-width: 400px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #333; text-align: center;">Skill2Earn X</h2>
          <p style="font-size: 16px; color: #555; text-align: center;">Your verification code is:</p>
          <div style="background: #f4f4f4; padding: 15px; border-radius: 8px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #000; margin: 20px 0;">
            ${token}
          </div>
          <p style="font-size: 12px; color: #888; text-align: center;">If you didn't request this, please ignore this email.</p>
        </div>
      `,
    });
 
    if (error) {
      throw new Error(JSON.stringify(error));
    }
  },
});
