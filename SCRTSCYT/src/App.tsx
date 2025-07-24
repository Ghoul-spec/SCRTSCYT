import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { useState } from "react";
import { MovieGrid } from "./components/MovieGrid";
import { FeaturedMovie } from "./components/FeaturedMovie";
import { Pagination } from "./components/Pagination";
import { SearchBar } from "./components/SearchBar";

export default function App() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  
  const featuredMovie = useQuery(api.movies.getFeaturedMovie);
  
  // Use search query if there's a search term, otherwise use regular getAllMovies
  const searchResults = useQuery(
    api.movies.searchMovies,
    searchTerm.trim() ? { searchTerm, page: currentPage, limit: 12 } : "skip"
  );
  
  const allMoviesData = useQuery(
    api.movies.getAllMovies,
    !searchTerm.trim() ? { page: currentPage, limit: 12 } : "skip"
  );
  
  const moviesData = searchTerm.trim() ? searchResults : allMoviesData;

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page when searching
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="relative z-50 bg-black/90 backdrop-blur-sm border-b border-red-900/30">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Logo Design */}
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-red-600 via-red-700 to-red-900 rounded-lg flex items-center justify-center shadow-lg glow-red">
                  <div className="relative">
                    {/* Eye symbol for secret society theme */}
                    <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                    </svg>
                    {/* Subtle inner glow */}
                    <div className="absolute inset-0 bg-red-400/20 rounded-full blur-sm"></div>
                  </div>
                </div>
                {/* Animated pulse ring */}
                <div className="absolute inset-0 w-12 h-12 border-2 border-red-500/30 rounded-lg animate-pulse-red"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent text-glow">
                  Secret Society
                </h1>
                <div className="text-xs text-gray-500 font-mono tracking-wider">
                  CLASSIFIED CONTENT
                </div>
              </div>
            </div>
            
            {/* Search Bar */}
            <div className="flex-1 max-w-md mx-8">
              <SearchBar 
                onSearch={handleSearch}
                placeholder="Search classified content..."
              />
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-4">
              <a 
                href="#" 
                onClick={() => {
                  setSearchTerm("");
                  setCurrentPage(1);
                }}
                className="text-gray-300 hover:text-red-400 transition-colors font-medium"
              >
                Home
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Featured Movie Section - only show when not searching */}
      {!searchTerm.trim() && featuredMovie && <FeaturedMovie movie={featuredMovie} />}

      {/* Movies Section */}
      <section className="py-12 px-6">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-white">
              <span className="border-l-4 border-red-600 pl-4">
                {searchTerm.trim() ? `Search Results for "${searchTerm}"` : "All Movies"}
              </span>
            </h2>
            <div className="text-gray-400 text-sm">
              {moviesData?.totalMovies} movies {searchTerm.trim() ? "found" : "available"}
            </div>
          </div>
          
          {moviesData && moviesData.movies.length > 0 ? (
            <>
              <MovieGrid movies={moviesData.movies} />
              <Pagination 
                currentPage={currentPage}
                totalPages={Math.min(moviesData.totalPages, 100)}
                onPageChange={setCurrentPage}
              />
            </>
          ) : searchTerm.trim() ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-800 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-300 mb-2">No classified content found</h3>
              <p className="text-gray-500 mb-6">
                Your search for "{searchTerm}" didn't match any files in our archives.
              </p>
              <button
                onClick={() => handleSearch("")}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Clear Search
              </button>
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-800 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-300 mb-2">No content available</h3>
              <p className="text-gray-500">
                The archive is currently empty. Content will appear here automatically.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-red-900/30 py-8 px-6">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            {/* Footer logo - smaller version */}
            <div className="relative">
              <div className="w-8 h-8 bg-gradient-to-br from-red-600 via-red-700 to-red-900 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                </svg>
              </div>
            </div>
            <span className="text-gray-400 font-semibold">Secret Society</span>
          </div>
          <p className="text-gray-500 text-sm">
            "What happens in the shadows, stays in the shadows."
          </p>
        </div>
      </footer>
    </div>
  );
}
