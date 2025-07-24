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

interface FeaturedMovieProps {
  movie: Movie;
}

export function FeaturedMovie({ movie }: FeaturedMovieProps) {
  return (
    <section className="relative h-[70vh] overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${movie.thumbnail})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 h-full flex items-center">
        <div className="max-w-2xl">
          <div className="mb-4">
            <span className="inline-block bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold mb-2">
              FEATURED
            </span>
            <div className="flex items-center space-x-4 text-gray-300 text-sm">
              <span>{movie.year}</span>
              <span>•</span>
              <span>{movie.duration}</span>
              <span>•</span>
              <span className="bg-gray-800 px-2 py-1 rounded">{movie.rating}</span>
              <span>•</span>
              <span>{movie.genre}</span>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white leading-tight">
            {movie.title}
          </h1>
          
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            {movie.description}
          </p>
          
          <div className="flex space-x-4">
            <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8 5v10l7-5z"/>
              </svg>
              <span>Watch Now</span>
            </button>
            <button className="bg-gray-800/80 hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>My List</span>
            </button>
          </div>
          
          <div className="mt-6 text-gray-400 text-sm">
            {movie.views.toLocaleString()} views
          </div>
        </div>
      </div>
    </section>
  );
}
