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
    projectDetails: v.optional(v.string()),
    source: v.optional(v.string()), // 'Admin' or 'User'
  },
  handler: async (ctx, args) => {
    // Prevent duplicate matches
    const existing = await ctx.db
      .query("matches")
      .filter((q) => 
        q.and(
          q.eq(q.field("talentName"), args.talentName),
          q.eq(q.field("startupName"), args.startupName),
          q.eq(q.field("role"), args.role)
        )
      )
      .first();

    if (existing) {
      return existing._id;
    }

    return await ctx.db.insert("matches", {
      ...args,
      status: args.source === 'User' ? "Pending Approval" : "Offered",
      date: new Date().toISOString(),
    });
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("matches"),
    status: v.string(),
    interviewDate: v.optional(v.string()),
    hiringStatus: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...rest } = args;
    await ctx.db.patch(id, rest);
  },
});

export const scheduleInterview = mutation({
  args: {
    id: v.id("matches"),
    interviewDate: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { 
      interviewDate: args.interviewDate,
      status: "Interview"
    });
  },
});

export const selectForHiring = mutation({
  args: {
    id: v.id("matches"),
    hiringStatus: v.string(), // 'Selected', 'Waitlisted', 'Rejected'
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { 
      hiringStatus: args.hiringStatus,
      status: args.hiringStatus === 'Selected' ? 'Hired' : 'Rejected'
    });
  },
});

export const remove = mutation({
  args: { id: v.id("matches") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const removeAll = mutation({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("matches").collect();
    for (const match of all) {
      await ctx.db.delete(match._id);
    }
  },
});
