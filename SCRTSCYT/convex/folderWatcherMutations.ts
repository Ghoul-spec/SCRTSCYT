import { internalMutation, mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Internal mutations for database operations
export const updateWatcherStatus = internalMutation({
  args: {
    isWatching: v.boolean(),
    folderPath: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("folderWatchStatus").first();
    
    if (existing) {
      await ctx.db.patch(existing._id, {
        isWatching: args.isWatching,
        folderPath: args.folderPath,
        lastProcessed: Date.now(),
      });
    } else {
      await ctx.db.insert("folderWatchStatus", {
        isWatching: args.isWatching,
        folderPath: args.folderPath,
        lastProcessed: Date.now(),
        totalProcessed: 0,
      });
    }
  },
});

export const createProcessingMovie = internalMutation({
  args: {
    fileName: v.string(),
    fileSize: v.number(),
  },
  handler: async (ctx, args) => {
    // Extract title from filename without path dependency
    const nameWithoutExt = args.fileName.replace(/\.[^/.]+$/, "");
    const title = nameWithoutExt
      .replace(/[_-]/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());

    return await ctx.db.insert("movies", {
      title: title,
      description: `Auto-imported from ${args.fileName}`,
      views: 0,
      isFeatured: false,
      isNew: true,
      processingStatus: "processing",
      originalFileName: args.fileName,
      fileSize: args.fileSize,
    });
  },
});

export const generateUploadUrl = internalMutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const completeMovieProcessing = internalMutation({
  args: {
    movieId: v.id("movies"),
    videoStorageId: v.string(),
    thumbnailStorageId: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.movieId, {
      thumbnail: args.thumbnailStorageId as any,
      videoUrl: args.videoStorageId as any,
      processingStatus: "completed",
    });
  },
});

export const markProcessingFailed = internalMutation({
  args: {
    fileName: v.string(),
    error: v.string(),
  },
  handler: async (ctx, args) => {
    const movie = await ctx.db
      .query("movies")
      .filter((q) => q.eq(q.field("originalFileName"), args.fileName))
      .first();
    
    if (movie) {
      await ctx.db.patch(movie._id, {
        processingStatus: "failed",
        description: `Processing failed: ${args.error}`,
      });
    }
  },
});

export const incrementProcessedCount = internalMutation({
  args: {},
  handler: async (ctx) => {
    const status = await ctx.db.query("folderWatchStatus").first();
    if (status) {
      await ctx.db.patch(status._id, {
        totalProcessed: status.totalProcessed + 1,
        lastProcessed: Date.now(),
      });
    }
  },
});

// Public queries
export const getWatcherStatus = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("folderWatchStatus").first();
  },
});

export const getProcessingMovies = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("movies")
      .withIndex("by_processing_status", (q) => q.eq("processingStatus", "processing"))
      .collect();
  },
});

// Public mutation to start watcher from frontend
export const initializeFolderWatcher = mutation({
  args: {},
  handler: async (ctx) => {
    // This will be called from the frontend to start the watcher
    return { message: "Watcher initialization requested" };
  },
});
