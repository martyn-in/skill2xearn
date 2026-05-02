import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const listAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("startups").order("desc").collect();
  },
});

export const submit = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    problem: v.string(),
    pitch: v.string(),
    vision: v.string(),
    impact: v.string(),
    owner: v.string(),
    isHiring: v.boolean(),
    hiringRole: v.string(),
    hiringPositions: v.string(),
  },
  handler: async (ctx, args) => {
    const riskScore = Math.floor(Math.random() * 100);
    const feasibility = 100 - riskScore;
    
    const id = await ctx.db.insert("startups", {
      ...args,
      riskScore,
      feasibility,
      status: "Pending Review",
      level: 1,
      investment: 0,
      recommendations: riskScore > 50 
        ? ["Refine business model", "Check market scalability", "Strengthen tech stack"]
        : ["Start angel round", "Hire core team"],
      createdAt: new Date().toISOString(),
    });
    return id;
  },
});

export const updateStatus = mutation({
  args: { id: v.id("startups"), status: v.string(), investment: v.number() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { 
      status: args.status, 
      investment: args.investment 
    });
  },
});

export const remove = mutation({
  args: { id: v.id("startups") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const removeAll = mutation({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("startups").collect();
    for (const s of all) {
      await ctx.db.delete(s._id);
    }
  },
});

export const negotiate = mutation({
  args: { 
    id: v.id("startups"), 
    priceAsk: v.optional(v.number()), 
    priceOffer: v.optional(v.number()), 
    status: v.string(),
    totalAgreed: v.optional(v.number())
  },
  handler: async (ctx, args) => {
    const update: any = { hiringNegotiationStatus: args.status };
    if (args.priceAsk !== undefined) update.hiringPriceAsk = args.priceAsk;
    if (args.priceOffer !== undefined) update.hiringPriceOffer = args.priceOffer;
    if (args.totalAgreed !== undefined) update.investment = args.totalAgreed;
    
    await ctx.db.patch(args.id, update);
  },
});
