interface Movie {
  _id: string;
  title: string;
  description: string;
  genre: string;
  year: number;
  duration: string;
  rating: string;
  thumbnail: string;
  videoUrl: string;
  views: number;
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
            <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
              {movie.rating}
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-white font-semibold text-sm line-clamp-2 group-hover:text-red-400 transition-colors">
              {movie.title}
            </h3>
            <div className="flex items-center justify-between mt-1 text-xs text-gray-400">
              <span>{movie.year}</span>
              <span>{movie.duration}</span>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {movie.views.toLocaleString()} views
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
