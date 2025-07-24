"use node";
import { action, internalAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";
import * as fs from "fs";
import * as path from "path";
import * as chokidar from "chokidar";

// Start the folder watcher
export const startFolderWatcher = action({
  args: {},
  handler: async (ctx) => {
    const uploadsPath = path.join(process.cwd(), "uploads");
    
    // Ensure uploads directory exists
    if (!fs.existsSync(uploadsPath)) {
      fs.mkdirSync(uploadsPath, { recursive: true });
      console.log(`Created uploads directory: ${uploadsPath}`);
    }

    // Update watcher status
    await ctx.runMutation(internal.folderWatcherMutations.updateWatcherStatus, {
      isWatching: true,
      folderPath: uploadsPath,
    });

    // Process existing files first
    const existingFiles = fs.readdirSync(uploadsPath);
    for (const file of existingFiles) {
      const filePath = path.join(uploadsPath, file);
      if (fs.statSync(filePath).isFile()) {
        await ctx.runAction(internal.folderWatcher.processNewFile, {
          filePath: filePath,
        });
      }
    }

    // Watch for new files
    const watcher = chokidar.watch(uploadsPath, {
      ignored: /^\./,
      persistent: true,
      ignoreInitial: true, // We already processed existing files
    });

    watcher.on('add', async (filePath) => {
      console.log(`New file detected: ${filePath}`);
      await ctx.runAction(internal.folderWatcher.processNewFile, {
        filePath: filePath,
      });
    });

    return { 
      message: "Folder watcher started successfully", 
      watchPath: uploadsPath,
      existingFilesProcessed: existingFiles.length
    };
  },
});

// Internal action to process newly added files
export const processNewFile = internalAction({
  args: { filePath: v.string() },
  handler: async (ctx, args) => {
    try {
      const filePath = args.filePath;
      const fileName = path.basename(filePath);
      const fileExt = path.extname(fileName).toLowerCase();
      const fileStats = fs.statSync(filePath);
      
      // Check if it's a video file
      const videoExtensions = ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm', '.mkv'];
      
      if (!videoExtensions.includes(fileExt)) {
        console.log(`Skipping non-video file: ${fileName}`);
        return;
      }

      console.log(`Processing video file: ${fileName}`);

      // Create initial movie record with processing status
      const movieId = await ctx.runMutation(internal.folderWatcherMutations.createProcessingMovie, {
        fileName: fileName,
        fileSize: fileStats.size,
      });

      // Read and upload the video file
      const videoBuffer = fs.readFileSync(filePath);
      const videoBlob = new Blob([videoBuffer], { type: `video/${fileExt.slice(1)}` });
      
      const videoUploadUrl = await ctx.runMutation(internal.folderWatcherMutations.generateUploadUrl);
      const videoResponse = await fetch(videoUploadUrl, {
        method: "POST",
        headers: { "Content-Type": videoBlob.type },
        body: videoBlob,
      });

      if (!videoResponse.ok) {
        throw new Error(`Failed to upload video: ${videoResponse.statusText}`);
      }

      const videoResult = await videoResponse.json();
      const videoStorageId = videoResult.storageId;

      // Generate placeholder thumbnail
      const thumbnailStorageId = await ctx.runAction(internal.folderWatcher.generateThumbnail, {
        videoPath: filePath,
      }) as string;

      // Update movie record with file IDs and complete processing
      await ctx.runMutation(internal.folderWatcherMutations.completeMovieProcessing, {
        movieId: movieId,
        videoStorageId: videoStorageId,
        thumbnailStorageId: thumbnailStorageId,
      });

      // Clean up the original file
      fs.unlinkSync(filePath);
      console.log(`Successfully processed and cleaned up: ${fileName}`);

      // Update watcher statistics
      await ctx.runMutation(internal.folderWatcherMutations.incrementProcessedCount);

    } catch (error) {
      console.error(`Error processing file ${args.filePath}:`, error);
      
      // Mark as failed if we have a movie ID
      const fileName = path.basename(args.filePath);
      await ctx.runMutation(internal.folderWatcherMutations.markProcessingFailed, {
        fileName: fileName,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  },
});

// Generate placeholder thumbnail
export const generateThumbnail = internalAction({
  args: { videoPath: v.string() },
  handler: async (ctx, args): Promise<string> => {
    // Create a simple placeholder thumbnail SVG
    const fileName = path.basename(args.videoPath, path.extname(args.videoPath));
    const canvas = `<svg width="1280" height="720" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#1f2937"/>
      <text x="50%" y="45%" text-anchor="middle" dy=".3em" fill="#9ca3af" font-family="Arial" font-size="32">
        ${fileName}
      </text>
      <circle cx="640" cy="400" r="60" fill="#ef4444" opacity="0.8"/>
      <polygon points="620,380 620,420 660,400" fill="white"/>
    </svg>`;
    
    const thumbnailBlob = new Blob([canvas], { type: 'image/svg+xml' });
    const uploadUrl: string = await ctx.runMutation(internal.folderWatcherMutations.generateUploadUrl);
    
    const response: Response = await fetch(uploadUrl, {
      method: "POST",
      headers: { "Content-Type": "image/svg+xml" },
      body: thumbnailBlob,
    });

    if (!response.ok) {
      throw new Error(`Failed to upload thumbnail: ${response.statusText}`);
    }

    const result: any = await response.json();
    return result.storageId;
  },
});
