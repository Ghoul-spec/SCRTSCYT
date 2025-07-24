import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  movies: defineTable({
    title: v.string(),
    description: v.string(),
    thumbnail: v.optional(v.id("_storage")),
    videoUrl: v.optional(v.id("_storage")),
    views: v.number(),
    isFeatured: v.optional(v.boolean()),
    isNew: v.optional(v.boolean()), // Track newly added movies
    processingStatus: v.optional(v.string()), // "processing", "completed", "failed"
    originalFileName: v.optional(v.string()),
    fileSize: v.optional(v.number()),
    duration: v.optional(v.number()),
  })
    .searchIndex("search_title", {
      searchField: "title",
    })
    .searchIndex("search_description", {
      searchField: "description",
    })
    .index("by_featured", ["isFeatured"])
    .index("by_new", ["isNew"])
    .index("by_processing_status", ["processingStatus"]),
  
  folderWatchStatus: defineTable({
    isWatching: v.boolean(),
    lastProcessed: v.number(),
    totalProcessed: v.number(),
    folderPath: v.string(),
  }),
});
