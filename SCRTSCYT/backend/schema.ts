import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  movies: defineTable({
    title: v.string(),
    description: v.string(),
    genre: v.string(),
    year: v.number(),
    duration: v.string(),
    rating: v.string(),
    thumbnail: v.string(),
    videoUrl: v.string(),
    isFeatured: v.boolean(),
    views: v.number(),
  }).index("by_featured", ["isFeatured"])
    .index("by_genre", ["genre"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
