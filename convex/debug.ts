import { action } from "./_generated/server";

export const getSiteUrl = action({
  args: {},
  handler: async (ctx) => {
    return process.env.CONVEX_SITE_URL || "not found";
  },
});
