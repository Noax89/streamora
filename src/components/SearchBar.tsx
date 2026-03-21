import React, { useState, useEffect, useRef } from 'react';
import { Search as SearchIcon, X, Star, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchMovies } from '../hooks/useMovies';
import { getImageUrl } from '../services/tmdb';
import { Link } from 'react-router-dom';
import { cn } from '../utils/cn';

export const SearchBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);
    return () => clearTimeout(timer);
  }, [query]);

  const { data: results, isLoading } = useSearchMovies(debouncedQuery);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(true)}
        className="text-gray-300 hover:text-white transition-colors p-2"
      >
        <SearchIcon className="w-5 h-5" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="fixed top-4 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 z-[70]"
            >
              <div className="bg-surface-light border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
                <div className="flex items-center p-4 gap-4 border-b border-white/5">
                  <SearchIcon className="w-6 h-6 text-brand" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search movies, actors, genres..."
                    className="flex-1 bg-transparent border-none outline-none text-lg text-white placeholder:text-gray-500"
                  />
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      setQuery('');
                    }}
                    className="p-2 hover:bg-white/5 rounded-full transition-colors"
                  >
                    <X className="w-6 h-6 text-gray-400" />
                  </button>
                </div>

                <div className="max-h-[60vh] overflow-y-auto p-4 scrollbar-hide">
                  {isLoading && (
                    <div className="flex items-center justify-center py-12">
                      <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}

                  {!isLoading && results && results.length > 0 && (
                    <div className="grid gap-4">
                      {results.slice(0, 6).map((movie) => (
                        <Link
                          key={movie.id}
                          to={`/movie/${movie.id}`}
                          onClick={() => setIsOpen(false)}
                          className="flex gap-4 p-2 hover:bg-white/5 rounded-xl transition-colors group"
                        >
                          <div className="w-16 h-24 rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={getImageUrl(movie.poster_path)}
                              alt={movie.title}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <div className="flex-1 flex flex-col justify-center">
                            <h4 className="font-bold text-white group-hover:text-brand transition-colors">
                              {movie.title}
                            </h4>
                            <div className="flex items-center gap-3 mt-1">
                              <div className="flex items-center gap-1 text-yellow-500 text-xs">
                                <Star className="w-3 h-3 fill-current" />
                                {movie.vote_average.toFixed(1)}
                              </div>
                              <span className="text-xs text-gray-400">
                                {movie.release_date?.split('-')[0]}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center pr-4">
                            <Play className="w-5 h-5 text-gray-600 group-hover:text-brand transition-colors" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}

                  {!isLoading && query && results?.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      No results found for "{query}"
                    </div>
                  )}

                  {!query && (
                    <div className="text-center py-12 text-gray-500">
                      Type something to start searching...
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
