interface Movie {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  views: number;
  isNew?: boolean;
  fileSize?: number;
}

interface MovieGridProps {
  movies: Movie[];
}

export function MovieGrid({ movies }: MovieGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
      {movies.map((movie) => (
        <div key={movie._id} className="group cursor-pointer">
          <div className="relative overflow-hidden rounded-lg bg-gray-900 aspect-[2/3] hover:scale-105 transition-transform duration-300">
            {/* New Badge */}
            {movie.isNew && (
              <div className="absolute top-2 left-2 z-10">
                <span className="bg-red-600 text-white px-2 py-1 rounded-full text-xs font-bold animate-pulse">
                  NEW
                </span>
              </div>
            )}
            
            <img
              src={movie.thumbnail}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="flex items-center justify-center mb-2">
                  <button className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition-colors">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8 5v10l7-5z"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-white font-semibold text-sm line-clamp-2 group-hover:text-red-400 transition-colors">
              {movie.title}
            </h3>
            <div className="text-xs text-gray-500 mt-1 flex justify-between">
              <span>{movie.views.toLocaleString()} views</span>
              {movie.fileSize && (
                <span>{(movie.fileSize / 1024 / 1024).toFixed(1)} MB</span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
