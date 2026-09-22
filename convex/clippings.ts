import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getClippings = query({
  args: { newspaper: v.optional(v.string()) },
  handler: async (ctx, args) => {
    if (args.newspaper) {
      return await ctx.db
        .query("clippings")
        .withIndex("by_newspaper", (q) => q.eq("newspaper", args.newspaper!))
        .collect();
    }
    return await ctx.db.query("clippings").collect();
  },
});

export const addClipping = mutation({
  args: {
    title: v.string(),
    newspaper: v.string(),
    date: v.optional(v.string()),
    topic: v.optional(v.string()),
    imageUrl: v.string(),
    summary: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("clippings", args);
  },
});
