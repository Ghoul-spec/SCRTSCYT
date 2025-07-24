import { mutation } from "./_generated/server";

// Create a test movie for debugging
export const createTestMovie = mutation({
  args: {},
  handler: async (ctx) => {
    // Create a simple SVG thumbnail
    const thumbnailSvg = `<svg width="1280" height="720" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#1f2937"/>
      <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#9ca3af" font-family="Arial" font-size="48">
        Test Movie
      </text>
    </svg>`;
    
    const thumbnailBlob = new Blob([thumbnailSvg], { type: 'image/svg+xml' });
    const uploadUrl = await ctx.storage.generateUploadUrl();
    
    const response = await fetch(uploadUrl, {
      method: "POST",
      headers: { "Content-Type": "image/svg+xml" },
      body: thumbnailBlob,
    });

    if (!response.ok) {
      throw new Error(`Failed to upload thumbnail: ${response.statusText}`);
    }

    const result = await response.json();
    const thumbnailStorageId = result.storageId;

    return await ctx.db.insert("movies", {
      title: "Test Movie",
      description: "This is a test movie to verify the system is working",
      thumbnail: thumbnailStorageId,
      videoUrl: thumbnailStorageId, // Using same file for both
      views: 0,
      isFeatured: true,
      isNew: true,
      processingStatus: "completed",
    });
  },
});

// Clear all movies for testing
export const clearAllMovies = mutation({
  args: {},
  handler: async (ctx) => {
    const movies = await ctx.db.query("movies").collect();
    for (const movie of movies) {
      await ctx.db.delete(movie._id);
    }
    return { deleted: movies.length };
  },
});
