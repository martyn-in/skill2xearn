import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const listAll = query({
  handler: async (ctx) => {
    return await ctx.db.query("matches").order("desc").collect();
  },
});

export const addMatch = mutation({
  args: {
    talentName: v.string(),
    startupName: v.string(),
    role: v.string(),
    projectDetails: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("matches", {
      ...args,
      status: "Offered",
      date: new Date().toISOString(),
    });
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("matches"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: args.status });
  },
});

export const remove = mutation({
  args: { id: v.id("matches") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
