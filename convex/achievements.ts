import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getAchievements = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("achievements").collect();
  },
});

export const addAchievement = mutation({
  args: {
    title: v.string(),
    year: v.number(),
    organization: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("achievements", args);
  },
});
