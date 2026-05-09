"use node";
import { action } from "./_generated/server";
import { ResendOTP } from "./ResendOTP";

export const test = action({
  args: {},
  handler: async (ctx) => {
    try {
      const token = await ResendOTP.options.generateVerificationToken();
      await ResendOTP.options.sendVerificationRequest({
        identifier: "test@example.com",
        provider: ResendOTP.options,
        token: token,
      });
      return "Success";
    } catch (e: any) {
      return e.toString();
    }
  },
});
