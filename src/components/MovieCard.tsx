import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Star, Play, Plus, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Movie, getImageUrl } from '../services/tmdb';
import { useWatchlistStore } from '../store/useWatchlistStore';
import { cn } from '../utils/cn';

interface MovieCardProps {
  movie: Movie;
  className?: string;
}

export const MovieCard = memo(({ movie, className }: MovieCardProps) => {
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlistStore();
  const isAdded = isInWatchlist(movie.id);
  const title = movie.title || movie.name;
  const date = movie.release_date || movie.first_air_date;
  const type = movie.title ? 'movie' : 'tv';

  const toggleWatchlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isAdded) {
      removeFromWatchlist(movie.id);
    } else {
      addToWatchlist(movie);
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={cn('relative group min-w-[160px] md:min-w-[220px] lg:min-w-[260px] aspect-[2/3] rounded-xl overflow-hidden shadow-lg border border-white/5', className)}
    >
      <Link to={`/${type}/${movie.id}`} className="block w-full h-full">
        <img
          src={getImageUrl(movie.poster_path)}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
          referrerPolicy="no-referrer"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1 text-yellow-500">
              <Star className="w-3 h-3 fill-current" />
              <span className="text-xs font-bold">{movie.vote_average.toFixed(1)}</span>
            </div>
            <span className="text-[10px] text-gray-300 font-medium">
              {date?.split('-')[0]}
            </span>
          </div>

          <h3 className="text-sm font-bold text-white mb-3 line-clamp-1">{title}</h3>

          <div className="flex items-center gap-2">
            <div className="bg-white text-black p-2 rounded-full hover:bg-brand hover:text-white transition-colors">
              <Play className="w-3 h-3 fill-current" />
            </div>
            <button
              onClick={toggleWatchlist}
              className={cn(
                'p-2 rounded-full border border-white/20 hover:bg-white/10 transition-colors',
                isAdded ? 'bg-brand/20 border-brand text-brand' : 'text-white'
              )}
            >
              {isAdded ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
});

MovieCard.displayName = 'MovieCard';
