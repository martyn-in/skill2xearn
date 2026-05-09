import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const viewer = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return null;
    }
    return await ctx.db.get(userId);
  },
});


export const listElite = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("isElite"), true))
      .collect();
  },
});

export const listAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("users").collect();
  },
});


export const syncProfile = mutation({
  args: {
    email: v.optional(v.string()),
    name: v.string(),
    score: v.number(),
    rank: v.string(),
    skills: v.array(v.object({ name: v.string(), score: v.number() })),
    certificates: v.optional(v.array(v.string())),
    lastUpdate: v.string(),
    marketAnalysis: v.optional(v.string()),
    role: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    const isElite = args.score >= 90;

    if (userId) {
      const { email, ...rest } = args;
      await ctx.db.patch(userId, { ...rest, isElite });
      return userId;
    }

    if (!args.email) {
      // Create/Update based on name if email not provided (for guest mode compatibility)
      const existingByName = await ctx.db
        .query("users")
        .filter((q) => q.eq(q.field("name"), args.name))
        .first();
      
      if (existingByName) {
        await ctx.db.patch(existingByName._id, { ...args, isElite });
        return existingByName._id;
      }
      
      // @ts-ignore
      return await ctx.db.insert("users", { ...args, isElite });
    }

    const existing = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", args.email))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, { ...args, isElite });
      return existing._id;
    } else {
      // @ts-ignore
      return await ctx.db.insert("users", { ...args, isElite });
    }
  },
});


export const remove = mutation({
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const removeAll = mutation({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("users").collect();
    for (const u of all) {
      await ctx.db.delete(u._id);
    }
  },
});
