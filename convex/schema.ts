import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  books: defineTable({
    title: v.string(),
    gujaratiTitle: v.optional(v.string()),
    isbn: v.optional(v.string()),
    year: v.optional(v.number()),
    publisher: v.optional(v.string()),
    description: v.optional(v.string()),
    coverUrl: v.optional(v.string()),
    isLibraryOfCongress: v.boolean(),
    featured: v.boolean(),
  }).index("by_year", ["year"]),

  clippings: defineTable({
    title: v.string(),
    newspaper: v.string(), // "Fulchhab" | "Mumbai Samachar" | "Gujarat Samachar"
    date: v.optional(v.string()),
    topic: v.optional(v.string()),
    imageUrl: v.string(),
    summary: v.optional(v.string()),
  }).index("by_newspaper", ["newspaper"]),

  achievements: defineTable({
    title: v.string(),
    year: v.number(),
    organization: v.string(),
    description: v.optional(v.string()),
  }),

  stats: defineTable({
    key: v.string(), // e.g. "youtube_subscribers", "youtube_views"
    value: v.number(),
    updatedAt: v.string(),
  }).index("by_key", ["key"]),
});
