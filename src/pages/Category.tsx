import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInfiniteMoviesByGenre, useInfiniteTvByGenre, useGenres, useTvGenres } from '../hooks/useMovies';
import { MovieCard } from '../components/MovieCard';
import { ChevronLeft, Filter, Loader2, Tv, Film } from 'lucide-react';
import { useInView } from 'react-intersection-observer';

export const Category = () => {
  const { type, id } = useParams<{ type: string; id: string }>();
  const isTv = type === 'tv';
  const { ref, inView } = useInView();

  const movieQuery = useInfiniteMoviesByGenre(id || '');
  const tvQuery = useInfiniteTvByGenre(id || '');

  const movieGenres = useGenres();
  const tvGenres = useTvGenres();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: dataLoading,
    isError,
  } = isTv ? tvQuery : movieQuery;

  const genresData = isTv ? tvGenres.data : movieGenres.data;
  const currentGenre = genresData?.find(g => g.id.toString() === id);

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (dataLoading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-brand border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 font-medium tracking-wide">Loading {isTv ? 'TV Shows' : 'Movies'}...</p>
        </div>
      </div>
    );
  }

  const allItems = data?.pages.flatMap(page => page.results) || [];

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
                {isTv ? <Tv className="w-4 h-4" /> : <Film className="w-4 h-4" />}
                <span className="text-xs font-bold uppercase tracking-widest">{isTv ? 'TV Show' : 'Movie'} Category</span>
              </div>
              <h1 className="text-4xl font-black tracking-tighter text-white uppercase">
                {currentGenre?.name || 'Loading...'}
              </h1>
            </div>
          </div>
          
          <div className="text-gray-500 text-sm font-medium">
            Total {allItems.length} results loaded
          </div>
        </div>

        {allItems.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
              {allItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (index % 20) * 0.05 }}
                >
                  <MovieCard movie={item} />
                </motion.div>
              ))}
            </div>

            <div
              ref={ref}
              className="mt-12 py-8 flex justify-center items-center"
            >
              {isFetchingNextPage ? (
                <div className="flex flex-col items-center gap-3 text-brand">
                  <Loader2 className="w-8 h-8 animate-spin" />
                  <span className="text-sm font-medium tracking-wide">Fetching more titles...</span>
                </div>
              ) : hasNextPage ? (
                <div className="h-10" />
              ) : (
                <p className="text-gray-500 font-medium italic underline decoration-brand/30">That's all the {isTv ? 'shows' : 'movies'} for this category!</p>
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-20 bg-surface-light rounded-3xl border border-white/5">
            <p className="text-gray-400 text-lg mb-6">No {isTv ? 'TV shows' : 'movies'} found in this category.</p>
            <Link 
              to="/" 
              className="px-8 py-3 bg-brand text-white font-bold rounded-full hover:bg-brand-light transition-all shadow-xl shadow-brand/20"
            >
              Return to Home
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
