import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Plus, Check, Star, Clock, Calendar, ChevronLeft, ExternalLink, Info, Globe, DollarSign, TrendingUp } from 'lucide-react';
import { useMovieDetails, useMovieVideos, useMovieCredits, useSimilarMovies, useWatchProviders } from '../hooks/useMovies';
import { getImageUrl } from '../services/tmdb';
import { useWatchlistStore } from '../store/useWatchlistStore';
import { cn } from '../utils/cn';
import { MovieRow } from '../components/MovieRow';
import { CategoryGrid } from '../components/CategoryGrid';

export const MovieDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { data: movie, isLoading } = useMovieDetails(id!);
  const { data: videos } = useMovieVideos(id!);
  const { data: cast } = useMovieCredits(id!);
  const { data: similar } = useSimilarMovies(id!);
  const { data: providers } = useWatchProviders(id!);
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlistStore();

  if (isLoading || !movie) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const isAdded = isInWatchlist(movie.id);
  const trailer = videos?.find((v) => v.type === 'Trailer' && v.site === 'YouTube');
  
  // Get US providers as default, or first available
  const usProviders = providers?.US || Object.values(providers || {})[0];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-surface pb-20"
    >
      {/* Banner */}
      <div className="relative h-[60vh] md:h-[80vh] w-full">
        <img
          src={getImageUrl(movie.backdrop_path, 'original')}
          alt={movie.title}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-linear-to-t from-surface via-surface/60 to-transparent" />
        <div className="absolute inset-0 bg-linear-to-r from-surface via-transparent to-transparent" />

        <Link
          to="/"
          className="absolute top-24 left-4 md:left-12 p-2 bg-black/40 backdrop-blur-md rounded-full hover:bg-brand transition-colors z-20"
        >
          <ChevronLeft className="w-6 h-6" />
        </Link>
      </div>

      {/* Content */}
      <div className="relative -mt-48 md:-mt-64 px-4 md:px-12 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left: Poster & Stats */}
        <div className="hidden lg:block space-y-8">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="rounded-2xl overflow-hidden shadow-2xl border border-white/10"
          >
            <img
              src={getImageUrl(movie.poster_path, 'original')}
              alt={movie.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </motion.div>

          {/* Movie Stats (My Idea) */}
          <div className="glass-card p-6 space-y-6">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Info className="w-5 h-5 text-brand" />
              Movie Stats
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm flex items-center gap-2">
                  <Globe className="w-4 h-4" /> Language
                </span>
                <span className="text-sm font-medium uppercase">{movie.original_language}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" /> Status
                </span>
                <span className="text-sm font-medium">{movie.status}</span>
              </div>
              {movie.budget > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm flex items-center gap-2">
                    <DollarSign className="w-4 h-4" /> Budget
                  </span>
                  <span className="text-sm font-medium">{formatCurrency(movie.budget)}</span>
                </div>
              )}
              {movie.revenue > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" /> Revenue
                  </span>
                  <span className="text-sm font-medium">{formatCurrency(movie.revenue)}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Details */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <div className="flex items-center gap-1 text-yellow-500 bg-yellow-500/10 px-3 py-1 rounded-full border border-yellow-500/20">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-sm font-bold">{movie.vote_average.toFixed(1)}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Clock className="w-4 h-4" />
                {movie.runtime} min
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Calendar className="w-4 h-4" />
                {movie.release_date.split('-')[0]}
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">{movie.title}</h1>
            <p className="text-brand text-lg font-medium italic mb-6">{movie.tagline}</p>

            <div className="flex flex-wrap gap-2 mb-8">
              {movie.genres.map((genre) => (
                <span
                  key={genre.id}
                  className="px-4 py-1 bg-white/5 border border-white/10 rounded-full text-sm text-gray-300"
                >
                  {genre.name}
                </span>
              ))}
            </div>

            <p className="text-gray-300 text-lg leading-relaxed mb-10 max-w-3xl">
              {movie.overview}
            </p>

            <div className="flex flex-wrap items-center gap-4 mb-12">
              <button className="btn-primary px-10 py-4 text-lg">
                <Play className="fill-current w-5 h-5" />
                Watch Now
              </button>
              <button
                onClick={() => (isAdded ? removeFromWatchlist(movie.id) : addToWatchlist(movie))}
                className={cn(
                  'btn-secondary px-10 py-4 text-lg',
                  isAdded && 'bg-brand/20 border-brand text-brand'
                )}
              >
                {isAdded ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                {isAdded ? 'In Watchlist' : 'Add to Watchlist'}
              </button>
            </div>

            {/* Where to Watch */}
            {usProviders && (usProviders.flatrate || usProviders.rent || usProviders.buy) && (
              <div className="mb-16">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <span className="w-1 h-6 bg-brand rounded-full" />
                  Where to Watch
                </h2>
                <div className="flex flex-wrap gap-8">
                  {usProviders.flatrate && (
                    <div className="space-y-3">
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Stream</p>
                      <div className="flex gap-3">
                        {usProviders.flatrate.map((p: any) => (
                          <div key={p.provider_id} title={p.provider_name} className="w-12 h-12 rounded-xl overflow-hidden border border-white/10">
                            <img src={getImageUrl(p.logo_path)} alt={p.provider_name} className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {usProviders.rent && (
                    <div className="space-y-3">
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Rent</p>
                      <div className="flex gap-3">
                        {usProviders.rent.map((p: any) => (
                          <div key={p.provider_id} title={p.provider_name} className="w-12 h-12 rounded-xl overflow-hidden border border-white/10">
                            <img src={getImageUrl(p.logo_path)} alt={p.provider_name} className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <a 
                  href={usProviders.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-brand hover:underline mt-6"
                >
                  View all providers <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            )}

            {/* Trailer */}
            {trailer && (
              <div className="mb-16">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <span className="w-1 h-6 bg-brand rounded-full" />
                  Official Trailer
                </h2>
                <div className="aspect-video w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                  <iframe
                    src={`https://www.youtube.com/embed/${trailer.key}`}
                    title="Movie Trailer"
                    className="w-full h-full"
                    allowFullScreen
                  />
                </div>
              </div>
            )}

            {/* Cast */}
            {cast && cast.length > 0 && (
              <div className="mb-16">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <span className="w-1 h-6 bg-brand rounded-full" />
                  Top Cast
                </h2>
                <div className="flex overflow-x-auto gap-6 pb-6 scrollbar-hide">
                  {cast.slice(0, 10).map((person) => (
                    <Link 
                      key={person.id} 
                      to={`/person/${person.id}`}
                      className="min-w-30 text-center group"
                    >
                      <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-2 border-white/10 group-hover:border-brand transition-colors mb-3">
                        <img
                          src={getImageUrl(person.profile_path)}
                          alt={person.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <p className="text-sm font-bold text-white line-clamp-1 group-hover:text-brand transition-colors">{person.name}</p>
                      <p className="text-xs text-gray-400 line-clamp-1">{person.character}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Similar Movies */}
            {similar && similar.length > 0 && (
              <div className="mb-16 -mx-4 md:mx-0">
                <MovieRow 
                  title="Related Movies" 
                  movies={similar} 
                  className="py-0"
                />
              </div>
            )}

            {/* Categories Section */}
            <CategoryGrid />

            {/* Notice Box */}
            <div className="mt-20 p-6 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-4">
              <div className="p-3 bg-brand/10 rounded-xl">
                <Info className="w-6 h-6 text-brand" />
              </div>
              <div>
                <h4 className="font-bold text-white mb-1">Data Attribution</h4>
                <p className="text-sm text-gray-400 leading-relaxed">
                  This application uses the TMDB API but is not endorsed or certified by TMDB. 
                  All movie data, images, and trailers are provided by <a href="https://www.themoviedb.org" target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">The Movie Database</a>.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};
