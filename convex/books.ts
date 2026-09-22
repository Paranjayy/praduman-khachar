import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getBooks = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("books").collect();
  },
});

export const addBook = mutation({
  args: {
    title: v.string(),
    gujaratiTitle: v.optional(v.string()),
    isbn: v.optional(v.string()),
    year: v.optional(v.number()),
    publisher: v.optional(v.string()),
    description: v.optional(v.string()),
    coverUrl: v.optional(v.string()),
    isLibraryOfCongress: v.boolean(),
    featured: v.boolean(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("books", args);
  },
});
