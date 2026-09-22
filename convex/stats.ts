import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getStats = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("stats").collect();
  },
});

export const updateStat = mutation({
  args: {
    key: v.string(),
    value: v.number(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("stats")
      .withIndex("by_key", (q) => q.eq("key", args.key))
      .first();

    const updatedAt = new Date().toISOString();

    if (existing) {
      await ctx.db.patch(existing._id, { value: args.value, updatedAt });
      return existing._id;
    } else {
      return await ctx.db.insert("stats", {
        key: args.key,
        value: args.value,
        updatedAt,
      });
    }
  },
});
