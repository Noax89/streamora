import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useInfiniteMovies } from '../hooks/useMovies';
import { endpoints } from '../services/tmdb';
import { MovieCard } from '../components/MovieCard';
import { motion } from 'framer-motion';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { useInView } from 'react-intersection-observer';

const CATEGORY_MAP: Record<string, { endpoint: string; title: string }> = {
  trending: { endpoint: endpoints.trending, title: 'Trending Now' },
  popular: { endpoint: endpoints.popular, title: 'Popular on Streamora' },
  'top-rated': { endpoint: endpoints.topRated, title: 'Top Rated Classics' },
  upcoming: { endpoint: endpoints.upcoming, title: 'Upcoming Releases' },
  trailers: { endpoint: endpoints.popular, title: 'Latest Trailers' },
  'trending-tv': { endpoint: endpoints.trendingTv, title: 'Trending TV Shows' },
  'popular-tv': { endpoint: endpoints.popularTv, title: 'Popular TV Shows' },
};

export const MovieList = () => {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const { ref, inView } = useInView();

  const categoryInfo = category ? CATEGORY_MAP[category] : null;

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteMovies(categoryInfo?.endpoint || '', {});

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (!categoryInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Category not found</h2>
          <button
            onClick={() => navigate('/')}
            className="text-brand hover:underline"
          >
            Go back home
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-24 pb-20 px-4 md:px-12"
    >
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          {categoryInfo.title}
        </h1>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="aspect-[2/3] bg-surface-light rounded-xl animate-shimmer"
            />
          ))}
        </div>
      ) : isError ? (
        <div className="text-center py-20">
          <p className="text-gray-400">Failed to load content. Please try again later.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {data?.pages.map((page, i) => (
              <React.Fragment key={i}>
                {page.results.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </React.Fragment>
            ))}
          </div>

          <div
            ref={ref}
            className="mt-12 py-8 flex justify-center items-center"
          >
            {isFetchingNextPage ? (
              <div className="flex flex-col items-center gap-3 text-brand">
                <Loader2 className="w-8 h-8 animate-spin" />
                <span className="text-sm font-medium">Loading more...</span>
              </div>
            ) : hasNextPage ? (
              <div className="h-10" /> // Trigger point
            ) : (
              <p className="text-gray-500 font-medium">You've reached the end of the list.</p>
            )}
          </div>
        </>
      )}
    </motion.div>
  );
};
