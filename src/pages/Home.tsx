import React from 'react';
import { Hero } from '../components/Hero';
import { MovieRow } from '../components/MovieRow';
import { TrailerSection } from '../components/TrailerSection';
import { CategoryGrid } from '../components/CategoryGrid';
import { useMovies } from '../hooks/useMovies';
import { endpoints } from '../services/tmdb';
import { motion } from 'framer-motion';

export const Home = () => {
  const { data: trending, isLoading: trendingLoading } = useMovies(endpoints.trending);
  const { data: popular, isLoading: popularLoading } = useMovies(endpoints.popular);
  const { data: topRated, isLoading: topRatedLoading } = useMovies(endpoints.topRated);
  const { data: upcoming, isLoading: upcomingLoading } = useMovies(endpoints.upcoming);
  const { data: trendingTv, isLoading: trendingTvLoading } = useMovies(endpoints.trendingTv);
  const { data: popularTv, isLoading: popularTvLoading } = useMovies(endpoints.popularTv);

  const featuredMovie = trending?.[0];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pb-20"
    >
      {featuredMovie && <Hero movie={featuredMovie} />}

      <div className="-mt-32 relative z-10">
        <MovieRow title="Trending Now" movies={trending || []} isLoading={trendingLoading} category="trending" />
        <MovieRow title="Trending TV Shows" movies={trendingTv || []} isLoading={trendingTvLoading} category="trending-tv" />
        <MovieRow title="Popular on Streamora" movies={popular || []} isLoading={popularLoading} category="popular" />
        <MovieRow title="Must-Watch Series" movies={popularTv || []} isLoading={popularTvLoading} category="popular-tv" />
        <MovieRow title="Top Rated Classics" movies={topRated || []} isLoading={topRatedLoading} category="top-rated" />
        <MovieRow title="Upcoming Releases" movies={upcoming || []} isLoading={upcomingLoading} category="upcoming" />
        
        <TrailerSection />
        <CategoryGrid />
      </div>
    </motion.div>
  );
};
