import { mutation } from "./_generated/server";
import { v } from "convex/values";

// This function is kept for reference but won't work with the new schema
// that requires storage IDs. Use the upload form instead.
export const seedMovies = mutation({
  args: {},
  handler: async (ctx) => {
    return "Seeding disabled. Use the upload form to add movies with proper file storage.";
  },
});
