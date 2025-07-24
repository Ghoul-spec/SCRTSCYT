import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState, useEffect } from "react";

export function FolderUploadStatus() {
  const watcherStatus = useQuery(api.folderWatcherMutations.getWatcherStatus);
  const processingMovies = useQuery(api.folderWatcherMutations.getProcessingMovies);
  const newMovies = useQuery(api.movies.getNewMovies, { limit: 5 });
  const markAsViewed = useMutation(api.movies.markMoviesAsViewed);
  const initializeWatcher = useMutation(api.folderWatcherMutations.initializeFolderWatcher);
  
  const [showNewMovies, setShowNewMovies] = useState(false);

  useEffect(() => {
    if (newMovies && newMovies.length > 0) {
      setShowNewMovies(true);
    }
  }, [newMovies]);

  const handleDismissNewMovies = async () => {
    if (newMovies && newMovies.length > 0) {
      await markAsViewed({ movieIds: newMovies.map(m => m._id) });
      setShowNewMovies(false);
    }
  };

  const handleStartWatcher = async () => {
    await initializeWatcher();
  };

  return (
    <div className="space-y-4">
      {/* Upload Instructions */}
      <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-white flex items-center space-x-2">
            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 1v6" />
            </svg>
            <span>Automatic Video Upload</span>
          </h3>
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
            watcherStatus?.isWatching 
              ? 'bg-green-900/50 text-green-400 border border-green-700' 
              : 'bg-gray-800 text-gray-400 border border-gray-600'
          }`}>
            {watcherStatus?.isWatching ? 'Active' : 'Inactive'}
          </div>
        </div>
        
        <div className="space-y-4 text-gray-300">
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-600">
            <h4 className="font-semibold text-white mb-2 flex items-center space-x-2">
              <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>How to Upload Videos</span>
            </h4>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Drop video files into the <code className="bg-gray-700 px-2 py-1 rounded text-red-400">/uploads</code> folder</li>
              <li>Videos are automatically detected and processed</li>
              <li>Thumbnails are generated from the first frame</li>
              <li>Movies appear on the homepage with "NEW" badges</li>
              <li>Original files are cleaned up after processing</li>
            </ol>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-600">
            <h4 className="font-semibold text-white mb-2 flex items-center space-x-2">
              <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Supported Formats</span>
            </h4>
            <div className="text-sm space-y-1">
              <p><strong>Video:</strong> MP4, AVI, MOV, WMV, FLV, WebM, MKV</p>
              <p><strong>Naming:</strong> Use descriptive filenames (becomes movie title)</p>
              <p><strong>Size:</strong> Optimize for web streaming</p>
            </div>
          </div>

          {watcherStatus && (
            <div className="flex justify-between text-sm">
              <span>Total Processed: <strong className="text-white">{watcherStatus.totalProcessed}</strong></span>
              <span>Last Activity: <strong className="text-white">{new Date(watcherStatus.lastProcessed).toLocaleTimeString()}</strong></span>
            </div>
          )}
        </div>

        {!watcherStatus?.isWatching && (
          <button
            onClick={handleStartWatcher}
            className="mt-4 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg text-sm transition-colors flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293H15M9 10V9a2 2 0 012-2h2a2 2 0 012 2v1M9 10v5a2 2 0 002 2h2a2 2 0 002-2v-5" />
            </svg>
            <span>Start Folder Watcher</span>
          </button>
        )}
      </div>

      {/* Processing Status */}
      {processingMovies && processingMovies.length > 0 && (
        <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-4">
          <h4 className="text-yellow-400 font-medium mb-2 flex items-center space-x-2">
            <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Processing Videos ({processingMovies.length})</span>
          </h4>
          <div className="space-y-1">
            {processingMovies.map((movie) => (
              <div key={movie._id} className="text-sm text-yellow-300 flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                <span>{movie.originalFileName || movie.title}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New Movies Notification */}
      {showNewMovies && newMovies && newMovies.length > 0 && (
        <div className="bg-green-900/20 border border-green-700 rounded-lg p-4 relative">
          <button
            onClick={handleDismissNewMovies}
            className="absolute top-2 right-2 text-green-400 hover:text-green-300"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <h4 className="text-green-400 font-medium mb-3 flex items-center space-x-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>New Videos Added ({newMovies.length})</span>
          </h4>
          
          <div className="space-y-3">
            {newMovies.slice(0, 3).map((movie) => (
              <div key={movie._id} className="flex items-center space-x-3 bg-green-900/10 rounded-lg p-2">
                <img 
                  src={movie.thumbnail} 
                  alt={movie.title}
                  className="w-16 h-10 object-cover rounded"
                />
                <div className="flex-1">
                  <div className="text-sm font-medium text-green-300">{movie.title}</div>
                  <div className="text-xs text-green-400/70">
                    {movie.fileSize ? `${(movie.fileSize / 1024 / 1024).toFixed(1)} MB` : ''}
                  </div>
                </div>
              </div>
            ))}
            {newMovies.length > 3 && (
              <div className="text-xs text-green-400/70 text-center">
                +{newMovies.length - 3} more videos available
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
