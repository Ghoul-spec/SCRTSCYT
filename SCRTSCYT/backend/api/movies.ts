import { query } from "../_generated/server";
import { v } from "convex/values";

export const getFeaturedMovie = query({
  args: {},
  handler: async (ctx) => {
    const featured = await ctx.db
      .query("movies")
      .withIndex("by_featured", (q) => q.eq("isFeatured", true))
      .first();
    
    if (featured) return featured;
    
    // Return first movie if no featured movie exists
    return await ctx.db.query("movies").first();
  },
});

export const getAllMovies = query({
  args: { 
    page: v.optional(v.number()),
    limit: v.optional(v.number()) 
  },
  handler: async (ctx, args) => {
    const page = args.page || 1;
    const limit = args.limit || 12;
    const offset = (page - 1) * limit;
    
    const movies = await ctx.db
      .query("movies")
      .order("desc")
      .collect();
    
    const totalMovies = movies.length;
    const totalPages = Math.ceil(totalMovies / limit);
    const paginatedMovies = movies.slice(offset, offset + limit);
    
    return {
      movies: paginatedMovies,
      totalPages,
      currentPage: page,
      totalMovies,
    };
  },
});

export const searchMovies = query({
  args: { 
    searchTerm: v.string(),
    page: v.optional(v.number()),
    limit: v.optional(v.number()) 
  },
  handler: async (ctx, args) => {
    const page = args.page || 1;
    const limit = args.limit || 12;
    const offset = (page - 1) * limit;
    
    if (!args.searchTerm.trim()) {
      return {
        movies: [],
        totalPages: 0,
        currentPage: page,
        totalMovies: 0,
      };
    }
    
    const allMovies = await ctx.db.query("movies").collect();
    const searchTerm = args.searchTerm.toLowerCase();
    
    const filteredMovies = allMovies.filter(movie => 
      movie.title.toLowerCase().includes(searchTerm) ||
      movie.description.toLowerCase().includes(searchTerm) ||
      movie.genre.toLowerCase().includes(searchTerm)
    );
    
    const totalMovies = filteredMovies.length;
    const totalPages = Math.ceil(totalMovies / limit);
    const paginatedMovies = filteredMovies.slice(offset, offset + limit);
    
    return {
      movies: paginatedMovies,
      totalPages,
      currentPage: page,
      totalMovies,
    };
  },
});

export const getMoviesByGenre = query({
  args: { genre: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("movies")
      .withIndex("by_genre", (q) => q.eq("genre", args.genre))
      .collect();
  },
});
