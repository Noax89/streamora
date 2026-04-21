import React from 'react';
import { motion } from 'framer-motion';
import { Play, Info, Star } from 'lucide-react';
import { Movie, getImageUrl } from '../services/tmdb';
import { Link } from 'react-router-dom';

interface HeroProps {
  movie: Movie;
}

export const Hero = ({ movie }: HeroProps) => {
  return (
    <div className="relative h-[85vh] md:h-screen w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={getImageUrl(movie.backdrop_path, 'original')}
          alt={movie.title}
          className="w-full h-full object-cover"
          loading="eager"
          fetchPriority="high"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-surface via-surface/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col justify-center px-4 md:px-12 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-brand/20 text-brand px-3 py-1 rounded-full text-xs font-bold border border-brand/30">
              FEATURED
            </span>
            <div className="flex items-center gap-1 text-yellow-500">
              <Star className="w-4 h-4 fill-current" />
              <span className="text-sm font-bold">{movie.vote_average.toFixed(1)}</span>
            </div>
            <span className="text-gray-400 text-sm">{movie.release_date?.split('-')[0]}</span>
          </div>

          <h1 className="text-5xl md:text-8xl font-display font-bold leading-tight mb-6 drop-shadow-2xl">
            {movie.title}
          </h1>

          <p className="text-gray-300 text-lg md:text-xl line-clamp-3 mb-8 max-w-2xl leading-relaxed">
            {movie.overview}
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Link to={`/movie/${movie.id}`} className="btn-primary text-lg px-8 py-3">
              <Play className="fill-current w-5 h-5" />
              Watch Now
            </Link>
            <Link to={`/movie/${movie.id}`} className="btn-secondary text-lg px-8 py-3">
              <Info className="w-5 h-5" />
              More Info
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
