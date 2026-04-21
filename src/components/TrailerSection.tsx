import React, { useState, useRef } from 'react';
import { Play, X, ChevronLeft, ChevronRight, Youtube } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useMovies } from '../hooks/useMovies';
import { endpoints, getImageUrl, tmdbApi } from '../services/tmdb';
import { cn } from '../utils/cn';

export const TrailerSection = () => {
  const { data: movies, isLoading } = useMovies(endpoints.popular);
  const [activeTrailer, setActiveTrailer] = useState<{ key: string; title: string } | null>(null);
  const [loadingTrailer, setLoadingTrailer] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  const handlePlayTrailer = async (movieId: number, title: string) => {
    setLoadingTrailer(movieId);
    try {
      const { data } = await tmdbApi.get(`/movie/${movieId}/videos`);
      const trailer = data.results.find((v: any) => v.type === 'Trailer' && v.site === 'YouTube');
      if (trailer) {
        setActiveTrailer({ key: trailer.key, title });
        setTimeout(() => {
          const player = document.getElementById('trailer-player');
          if (player) {
            window.scrollTo({ top: player.offsetTop - 100, behavior: 'smooth' });
          }
        }, 100);
      } else {
        alert('No trailer found for this movie.');
      }
    } catch (error) {
      console.error('Error fetching trailer:', error);
    } finally {
      setLoadingTrailer(null);
    }
  };

  if (isLoading) return null;

  return (
    <div className="py-12 bg-surface-light/30 border-y border-white/5">
      <div className="px-4 md:px-12 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-3">
              <span className="w-1 h-8 bg-brand rounded-full" />
              Latest Trailers
            </h2>
            <Link
              to="/movies/trailers"
              className="text-sm font-bold text-brand hover:text-brand-light transition-colors uppercase tracking-widest hidden sm:block"
            >
              View All
            </Link>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => scroll('left')}
              className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {activeTrailer && (
          <motion.div
            id="trailer-player"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="px-4 md:px-12 mb-12 overflow-hidden"
          >
            <div className="relative aspect-video w-full max-w-5xl mx-auto rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${activeTrailer.key}?autoplay=1`}
                title={activeTrailer.title}
                className="w-full h-full"
                loading="lazy"
                allowFullScreen
                allow="autoplay"
              />
              <button
                onClick={() => setActiveTrailer(null)}
                className="absolute top-4 right-4 p-2 bg-black/60 backdrop-blur-md rounded-full hover:bg-brand transition-colors z-10"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="max-w-5xl mx-auto mt-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">{activeTrailer.title}</h3>
              <div className="flex items-center gap-2 text-red-500 text-sm font-bold uppercase tracking-widest">
                <Youtube className="w-5 h-5" />
                YouTube Official
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative group">
        <div
          ref={scrollRef}
          className="flex overflow-x-auto gap-6 px-4 md:px-12 pb-4 scrollbar-hide scroll-smooth"
        >
          {movies?.slice(0, 10).map((movie) => (
            <div
              key={movie.id}
              className="min-w-70 md:min-w-[320px] aspect-video relative rounded-xl overflow-hidden cursor-pointer group/item border border-white/5 hover:border-brand/50 transition-all"
              onClick={() => handlePlayTrailer(movie.id, movie.title || '')}
            >
              <img
                src={getImageUrl(movie.backdrop_path)}
                alt={movie.title || 'Movie'}
                className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-500"
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
              
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/item:opacity-100 transition-opacity">
                <div className="w-16 h-16 bg-brand rounded-full flex items-center justify-center shadow-2xl scale-90 group-hover/item:scale-100 transition-transform">
                  {loadingTrailer === movie.id ? (
                    <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Play className="w-8 h-8 fill-white text-white ml-1" />
                  )}
                </div>
              </div>

              <div className="absolute bottom-4 left-4 right-4">
                <h4 className="text-white font-bold text-lg line-clamp-1 mb-1">{movie.title || 'Untitled'}</h4>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-brand bg-brand/10 px-2 py-0.5 rounded border border-brand/20">
                    Trailer
                  </span>
                  <span className="text-xs text-gray-400">
                    {movie.release_date?.split('-')[0] || ''}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
