# Secret Society - Automatic Video Streaming Platform

A Netflix-style video streaming platform with seamless automatic folder-based uploads and real-time processing.

## Features

### 🎬 Core Features
- **Netflix-style Interface**: Dark theme with red accents and mysterious "Secret Society" branding
- **Video Streaming**: Full video playback with thumbnails and metadata
- **Search & Discovery**: Full-text search across titles and descriptions
- **Pagination**: Efficient browsing of large video collections

### 📁 Automatic Upload System
- **Drop & Go**: Simply drop video files into the `/uploads` folder
- **Zero Configuration**: No manual uploads or forms required
- **Auto-Processing**: Videos are automatically processed and added to the platform
- **Thumbnail Generation**: Automatic thumbnail extraction from video files
- **Real-time Updates**: Homepage updates instantly when new videos are detected
- **Status Tracking**: Visual indicators for processing status and new content

### 🔧 Technical Features
- **File Watching**: Monitors upload folder for new video files using Chokidar
- **Automatic Metadata**: Extracts title from filename and generates descriptions
- **Storage Management**: Efficient file storage with Convex backend
- **Error Handling**: Robust error handling for failed uploads
- **Clean Architecture**: Organized folder structure and modular components

## How to Use

### Automatic Folder Upload (Only Method)
1. Click the "Upload Status" button to view system status
2. Drop video files into the `/uploads` directory
3. Files are automatically detected and processed in the background
4. New movies appear with "NEW" badges on the homepage
5. Receive notifications when processing completes
6. Original files are automatically cleaned up after processing

### Supported Formats
- **Video**: MP4, AVI, MOV, WMV, FLV, WebM, MKV
- **Thumbnails**: Auto-generated from first frame of video

## File Organization

```
/uploads/           # Drop video files here for auto-processing
/convex/           # Backend functions and schema
  ├── folderWatcher.ts    # File monitoring and processing
  ├── movies.ts          # Movie CRUD operations
  └── schema.ts          # Database schema
/src/components/   # React components
  ├── FolderUploadStatus.tsx  # Upload status panel
  ├── MovieGrid.tsx          # Video grid display
  └── ...
```

## Processing Workflow

1. **File Detection**: Chokidar monitors `/uploads` folder in real-time
2. **Validation**: Checks file type and size
3. **Upload**: Transfers video to Convex storage
4. **Thumbnail**: Extracts frame using FFmpeg and optimizes with Sharp
5. **Database**: Creates movie record with auto-generated metadata
6. **Cleanup**: Removes original file from uploads folder
7. **Notification**: Updates UI with new content indicator

## Status Indicators

- 🟢 **Active**: Folder watcher is running and monitoring
- 🟡 **Processing**: Videos being processed in background
- 🔴 **Failed**: Processing errors (check logs)
- ⭐ **NEW**: Recently added content with dismissible notifications

## Environment Setup

The system automatically:
- Creates the `/uploads` directory if it doesn't exist
- Starts monitoring when the folder watcher is initialized
- Processes any existing files in the uploads folder
- No additional configuration required

## Best Practices

1. **File Naming**: Use descriptive filenames (automatically becomes movie title)
2. **File Size**: Optimize videos for web streaming before uploading
3. **Batch Processing**: Drop multiple files at once for efficient processing
4. **Monitoring**: Check upload status panel for real-time processing updates
5. **Organization**: Keep original files organized before dropping into uploads folder

## Key Benefits

- **Seamless Experience**: No forms, no manual metadata entry
- **Automatic Processing**: Set it and forget it approach
- **Real-time Feedback**: Instant status updates and notifications
- **Clean Interface**: Focus on content discovery, not upload complexity
- **Scalable**: Handles multiple files and batch processing efficiently

---

*"What happens in the shadows, stays in the shadows."*

**Simply drop your videos into `/uploads` and watch them appear automatically on your secret streaming platform.**
