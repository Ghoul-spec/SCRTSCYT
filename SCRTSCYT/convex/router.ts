import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

const http = httpRouter();

// Remote upload endpoint
http.route({
  path: "/upload",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const formData = await request.formData();
      
      // Extract movie metadata
      const title = formData.get("title") as string;
      const description = formData.get("description") as string;
      const isFeatured = formData.get("isFeatured") === "true";
      
      // Get files
      const thumbnailFile = formData.get("thumbnail") as File;
      const videoFile = formData.get("video") as File | null;
      
      if (!title || !description || !thumbnailFile) {
        return new Response(
          JSON.stringify({ error: "Missing required fields" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
      
      // Upload thumbnail
      const thumbnailUploadUrl = await ctx.runMutation(api.movies.generateUploadUrl);
      const thumbnailResponse = await fetch(thumbnailUploadUrl, {
        method: "POST",
        headers: { "Content-Type": thumbnailFile.type },
        body: thumbnailFile,
      });
      
      if (!thumbnailResponse.ok) {
        throw new Error("Failed to upload thumbnail");
      }
      
      const thumbnailResult = await thumbnailResponse.json();
      const thumbnailId = thumbnailResult.storageId;
      
      // Upload video if provided
      let videoId = undefined;
      if (videoFile) {
        const videoUploadUrl = await ctx.runMutation(api.movies.generateUploadUrl);
        const videoResponse = await fetch(videoUploadUrl, {
          method: "POST",
          headers: { "Content-Type": videoFile.type },
          body: videoFile,
        });
        
        if (!videoResponse.ok) {
          throw new Error("Failed to upload video");
        }
        
        const videoResult = await videoResponse.json();
        videoId = videoResult.storageId;
      }
      
      // Create movie record
      const movieId = await ctx.runMutation(api.movies.createMovie, {
        title,
        description,
        thumbnailId: thumbnailId as any,
        videoId: videoId as any,
        isFeatured,
      });
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          movieId,
          message: "Movie uploaded successfully" 
        }),
        { 
          status: 200, 
          headers: { 
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type"
          } 
        }
      );
      
    } catch (error) {
      console.error("Upload error:", error);
      return new Response(
        JSON.stringify({ 
          error: "Upload failed", 
          details: error instanceof Error ? error.message : "Unknown error" 
        }),
        { 
          status: 500, 
          headers: { 
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          } 
        }
      );
    }
  }),
});

// Handle CORS preflight
http.route({
  path: "/upload",
  method: "OPTIONS",
  handler: httpAction(async (ctx, request) => {
    return new Response(null, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }),
});

export default http;
