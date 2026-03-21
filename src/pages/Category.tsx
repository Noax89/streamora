import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useMoviesByGenre, useGenres } from '../hooks/useMovies';
import { MovieCard } from '../components/MovieCard';
import { ChevronLeft, Filter } from 'lucide-react';

export const Category = () => {
  const { id } = useParams<{ id: string }>();
  const { data: movies, isLoading: moviesLoading } = useMoviesByGenre(id || '');
  const { data: genres } = useGenres();

  const currentGenre = genres?.find(g => g.id.toString() === id);

  if (moviesLoading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface pt-24 pb-20 px-4 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-4">
            <Link 
              to="/" 
              className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
            >
              <ChevronLeft className="w-6 h-6" />
            </Link>
            <div>
              <div className="flex items-center gap-2 text-brand mb-1">
                <Filter className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-widest">Category</span>
              </div>
              <h1 className="text-4xl font-black tracking-tighter text-white uppercase">
                {currentGenre?.name || 'Movies'}
              </h1>
            </div>
          </div>
          
          <div className="text-gray-500 text-sm font-medium">
            Showing {movies?.length || 0} results
          </div>
        </div>

        {movies && movies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {movies.map((movie, index) => (
              <motion.div
                key={movie.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <MovieCard movie={movie} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No movies found in this category.</p>
            <Link to="/" className="text-brand hover:underline mt-4 inline-block">
              Return to Home
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
