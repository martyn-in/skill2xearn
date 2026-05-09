import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,
  users: defineTable({
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),
    // Custom fields from previous implementation
    score: v.optional(v.number()),
    rank: v.optional(v.string()),
    skills: v.optional(v.array(v.object({
      name: v.string(),
      score: v.number(),
    }))),
    certificates: v.optional(v.array(v.string())),
    lastUpdate: v.optional(v.string()),
    isElite: v.optional(v.boolean()),
    marketAnalysis: v.optional(v.string()),
    role: v.optional(v.string()), // 'admin', 'founder', 'viewer', etc.
  }).index("email", ["email"]),
  startups: defineTable({
    title: v.string(),
    description: v.string(),
    problem: v.string(),
    pitch: v.string(),
    vision: v.string(),
    impact: v.string(),
    owner: v.string(),
    riskScore: v.number(),
    feasibility: v.number(),
    status: v.string(),
    level: v.number(),
    isHiring: v.boolean(),
    hiringRole: v.string(),
    hiringPositions: v.string(),
    investment: v.number(),
    recommendations: v.array(v.string()),
    createdAt: v.string(),
  }),
  matches: defineTable({
    talentName: v.string(),
    startupName: v.string(),
    role: v.string(),
    projectDetails: v.optional(v.string()),
    status: v.optional(v.string()), // 'Offered', 'Accepted', 'Interview', 'Hired', 'Rejected'
    date: v.string(),
    interviewDate: v.optional(v.string()),
    hiringStatus: v.optional(v.string()), // 'Selected', 'Waitlisted', 'Rejected'
    source: v.optional(v.string()), // 'Admin' or 'User'
  }),
});
