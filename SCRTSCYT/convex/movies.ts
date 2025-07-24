import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Get all movies with pagination
export const getAllMovies = query({
  args: { 
    page: v.number(), 
    limit: v.number() 
  },
  handler: async (ctx, args) => {
    const movies = await ctx.db
      .query("movies")
      .filter((q) => q.eq(q.field("processingStatus"), "completed"))
      .order("desc")
      .paginate({ numItems: args.limit, cursor: null });
    
    const totalMovies = await ctx.db
      .query("movies")
      .filter((q) => q.eq(q.field("processingStatus"), "completed"))
      .collect();
    
    // Get URLs for thumbnails and videos
    const moviesWithUrls = await Promise.all(
      movies.page.map(async (movie) => ({
        ...movie,
        thumbnail: await ctx.storage.getUrl(movie.thumbnail) || "",
        videoUrl: await ctx.storage.getUrl(movie.videoUrl) || "",
      }))
    );
    
    return {
      movies: moviesWithUrls,
      totalMovies: totalMovies.length,
      totalPages: Math.ceil(totalMovies.length / args.limit),
      currentPage: args.page,
      hasNextPage: !movies.isDone,
      hasPreviousPage: args.page > 1
    };
  },
});

// Get new movies (recently added)
export const getNewMovies = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const movies = await ctx.db
      .query("movies")
      .withIndex("by_new", (q) => q.eq("isNew", true))
      .filter((q) => q.eq(q.field("processingStatus"), "completed"))
      .order("desc")
      .take(args.limit || 10);

    const moviesWithUrls = await Promise.all(
      movies.map(async (movie) => ({
        ...movie,
        thumbnail: await ctx.storage.getUrl(movie.thumbnail) || "",
        videoUrl: await ctx.storage.getUrl(movie.videoUrl) || "",
      }))
    );

    return moviesWithUrls;
  },
});

// Mark movies as no longer new
export const markMoviesAsViewed = mutation({
  args: { movieIds: v.array(v.id("movies")) },
  handler: async (ctx, args) => {
    for (const movieId of args.movieIds) {
      await ctx.db.patch(movieId, { isNew: false });
    }
  },
});

// Search movies
export const searchMovies = query({
  args: {
    searchTerm: v.string(),
    page: v.number(),
    limit: v.number()
  },
  handler: async (ctx, args) => {
    const titleResults = await ctx.db
      .query("movies")
      .withSearchIndex("search_title", (q) =>
        q.search("title", args.searchTerm)
      )
      .filter((q) => q.eq(q.field("processingStatus"), "completed"))
      .collect();

    const descriptionResults = await ctx.db
      .query("movies")
      .withSearchIndex("search_description", (q) =>
        q.search("description", args.searchTerm)
      )
      .filter((q) => q.eq(q.field("processingStatus"), "completed"))
      .collect();

    // Combine and deduplicate results
    const allResults = [...titleResults, ...descriptionResults];
    const uniqueResults = allResults.filter((movie, index, self) => 
      index === self.findIndex(m => m._id === movie._id)
    );

    const startIndex = (args.page - 1) * args.limit;
    const endIndex = startIndex + args.limit;
    const paginatedResults = uniqueResults.slice(startIndex, endIndex);

    // Get URLs for thumbnails and videos
    const moviesWithUrls = await Promise.all(
      paginatedResults.map(async (movie) => ({
        ...movie,
        thumbnail: await ctx.storage.getUrl(movie.thumbnail) || "",
        videoUrl: await ctx.storage.getUrl(movie.videoUrl) || "",
      }))
    );

    return {
      movies: moviesWithUrls,
      totalMovies: uniqueResults.length,
      totalPages: Math.ceil(uniqueResults.length / args.limit),
      currentPage: args.page,
      hasNextPage: endIndex < uniqueResults.length,
      hasPreviousPage: args.page > 1
    };
  },
});

// Get featured movie
export const getFeaturedMovie = query({
  args: {},
  handler: async (ctx) => {
    const featuredMovie = await ctx.db
      .query("movies")
      .filter((q) => q.and(
        q.eq(q.field("isFeatured"), true),
        q.eq(q.field("processingStatus"), "completed")
      ))
      .first();
    
    if (featuredMovie) {
      return {
        ...featuredMovie,
        thumbnail: await ctx.storage.getUrl(featuredMovie.thumbnail) || "",
        videoUrl: await ctx.storage.getUrl(featuredMovie.videoUrl) || "",
      };
    }
    
    // If no featured movie, return the most recent one
    const latestMovie = await ctx.db
      .query("movies")
      .filter((q) => q.eq(q.field("processingStatus"), "completed"))
      .order("desc")
      .first();
    
    if (latestMovie) {
      return {
        ...latestMovie,
        thumbnail: await ctx.storage.getUrl(latestMovie.thumbnail) || "",
        videoUrl: await ctx.storage.getUrl(latestMovie.videoUrl) || "",
      };
    }
    
    return null;
  },
});

// Get movie by ID with file URLs
export const getMovieById = query({
  args: { movieId: v.id("movies") },
  handler: async (ctx, args) => {
    const movie = await ctx.db.get(args.movieId);
    if (!movie) return null;

    const thumbnailUrl = await ctx.storage.getUrl(movie.thumbnail);
    const videoUrl = movie.videoUrl ? await ctx.storage.getUrl(movie.videoUrl) : null;

    return {
      ...movie,
      thumbnailUrl,
      videoUrl,
    };
  },
});

// Update movie (no auth required)
export const updateMovie = mutation({
  args: {
    movieId: v.id("movies"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    thumbnailId: v.optional(v.id("_storage")),
    videoId: v.optional(v.id("_storage")),
    isFeatured: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { movieId, ...updates } = args;
    
    const updateData: any = {};
    if (updates.title !== undefined) updateData.title = updates.title;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.thumbnailId !== undefined) updateData.thumbnail = updates.thumbnailId;
    if (updates.videoId !== undefined) updateData.videoUrl = updates.videoId;
    if (updates.isFeatured !== undefined) updateData.isFeatured = updates.isFeatured;

    await ctx.db.patch(movieId, updateData);
    return movieId;
  },
});

// Delete movie (no auth required)
export const deleteMovie = mutation({
  args: { movieId: v.id("movies") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.movieId);
    return args.movieId;
  },
});

// Increment movie views
export const incrementViews = mutation({
  args: { movieId: v.id("movies") },
  handler: async (ctx, args) => {
    const movie = await ctx.db.get(args.movieId);
    if (movie) {
      await ctx.db.patch(args.movieId, {
        views: movie.views + 1,
      });
    }
  },
});

// Generate upload URL for file storage
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

// Create movie (no auth required)
export const createMovie = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    thumbnailId: v.id("_storage"),
    videoId: v.optional(v.id("_storage")),
    isFeatured: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("movies", {
      title: args.title,
      description: args.description,
      thumbnail: args.thumbnailId,
      videoUrl: args.videoId || args.thumbnailId,
      views: 0,
      isFeatured: args.isFeatured || false,
      isNew: true,
      processingStatus: "completed",
    });
  },
});
