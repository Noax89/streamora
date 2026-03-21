import React from 'react';
import { motion } from 'framer-motion';
import { Bookmark, Trash2, Film } from 'lucide-react';
import { useWatchlistStore } from '../store/useWatchlistStore';
import { MovieCard } from '../components/MovieCard';
import { Link } from 'react-router-dom';

export const Watchlist = () => {
  const { watchlist, removeFromWatchlist } = useWatchlistStore();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-surface pt-32 pb-20 px-4 md:px-12"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold mb-2 flex items-center gap-4">
              <Bookmark className="w-10 h-10 text-brand" />
              My Watchlist
            </h1>
            <p className="text-gray-400 text-lg">
              You have {watchlist.length} movies saved to watch later.
            </p>
          </div>
        </div>

        {watchlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="bg-white/5 p-8 rounded-full mb-6">
              <Film className="w-16 h-16 text-gray-500" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Your watchlist is empty</h2>
            <p className="text-gray-400 mb-8 max-w-md">
              Start adding your favorite movies to your watchlist so you can easily find them later.
            </p>
            <Link to="/" className="btn-primary px-8 py-3">
              Explore Movies
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {watchlist.map((movie) => (
              <div key={movie.id} className="relative group">
                <MovieCard movie={movie} className="w-full" />
                <button
                  onClick={() => removeFromWatchlist(movie.id)}
                  className="absolute top-2 right-2 p-2 bg-black/60 backdrop-blur-md rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-brand z-10"
                  title="Remove from watchlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};
