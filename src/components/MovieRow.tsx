import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MovieCard } from './MovieCard';
import { Movie } from '../services/tmdb';
import { cn } from '../utils/cn';

interface MovieRowProps {
  title: string;
  movies: Movie[];
  isLoading?: boolean;
  className?: string;
}

export const MovieRow = ({ title, movies, isLoading, className }: MovieRowProps) => {
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  if (isLoading) {
    return (
      <div className={cn("py-8 px-4 md:px-12", className)}>
        <div className="h-8 w-48 bg-surface-light rounded-md mb-6 animate-shimmer" />
        <div className="flex gap-4 overflow-hidden">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="min-w-200px aspect-2/3 bg-surface-light rounded-xl animate-shimmer" />
          ))}
        </div>
      </div>
    );
  }

  if (!movies || movies.length === 0) return null;

  return (
    <div className={cn("group relative py-8", className)}>
      <h2 className="text-xl md:text-2xl font-bold px-4 md:px-12 mb-6 tracking-wide flex items-center gap-3">
        <span className="w-1 h-6 bg-brand rounded-full" />
        {title}
      </h2>

      <div className="relative">
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-0 bottom-8 z-40 w-12 md:w-16 bg-linear-to-r from-surface to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
        >
          <ChevronLeft className="w-8 h-8 text-white" />
        </button>

        <div
          ref={scrollRef}
          className="flex overflow-x-auto gap-4 md:gap-6 px-4 md:px-12 pb-8 scrollbar-hide scroll-smooth"
        >
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>

        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-0 bottom-8 z-40 w-12 md:w-16 bg-linear-to-l from-surface to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
        >
          <ChevronRight className="w-8 h-8 text-white" />
        </button>
      </div>
    </div>
  );
};
