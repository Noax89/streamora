import React from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Plus, Check, Star, Clock, Calendar, ChevronLeft, ExternalLink, Info, Globe, DollarSign, TrendingUp, Tv, Film, Hash, Users } from 'lucide-react';
import { 
  useMovieDetails, 
  useMovieVideos, 
  useMovieCredits, 
  useSimilarMovies, 
  useWatchProviders,
  useTvDetails,
  useTvVideos,
  useTvCredits
} from '../hooks/useMovies';
import { getImageUrl } from '../services/tmdb';
import { useWatchlistStore } from '../store/useWatchlistStore';
import { cn } from '../utils/cn';
import { MovieRow } from '../components/MovieRow';
import { CategoryGrid } from '../components/CategoryGrid';
import { TvSeasonSelector } from '../components/TvSeasonSelector';

export const MovieDetails = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const isTv = location.pathname.startsWith('/tv');

  const movieDetails = useMovieDetails(id!);
  const tvDetails = useTvDetails(id!);
  
  const movieVideos = useMovieVideos(id!);
  const tvVideos = useTvVideos(id!);

  const movieCredits = useMovieCredits(id!);
  const tvCredits = useTvCredits(id!);

  const similarQuery = useSimilarMovies(id!);
  const providersQuery = useWatchProviders(id!);
  
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlistStore();

  const isLoading = isTv ? tvDetails.isLoading : movieDetails.isLoading;
  const media = isTv ? (tvDetails.data as any) : (movieDetails.data as any);
  const videos = isTv ? tvVideos.data : movieVideos.data;
  const cast = isTv ? tvCredits.data : movieCredits.data;
  const similar = similarQuery.data;
  const providers = providersQuery.data;

  if (isLoading || !media) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-brand border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 font-medium">Fetching details...</p>
        </div>
      </div>
    );
  }

  const isAdded = isInWatchlist(media.id);
  const trailer = videos?.find((v) => (v.type === 'Trailer' || v.type === 'Teaser') && v.site === 'YouTube');
  
  const usProviders = providers?.US || Object.values(providers || {})[0];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const title = media.title || media.name;
  const releaseDate = media.release_date || media.first_air_date;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-surface pb-20"
    >
      {/* Banner */}
      <div className="relative h-[60vh] md:h-[85vh] w-full">
        <img
          src={getImageUrl(media.backdrop_path, 'original')}
          alt={title}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-surface via-transparent to-transparent" />

        <Link
          to="/"
          className="absolute top-24 left-4 md:left-12 p-3 bg-black/40 backdrop-blur-xl rounded-full hover:bg-brand transition-all z-20 hover:scale-110 active:scale-95"
        >
          <ChevronLeft className="w-6 h-6" />
        </Link>

        {isTv && (
          <div className="absolute top-24 right-4 md:right-12 px-4 py-2 bg-brand/20 backdrop-blur-xl border border-brand/30 rounded-full flex items-center gap-2 z-20">
            <Tv className="w-4 h-4 text-brand" />
            <span className="text-xs font-bold text-white uppercase tracking-widest">TV Series</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="relative -mt-48 md:-mt-64 px-4 md:px-12 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left: Poster & Stats */}
        <div className="hidden lg:block space-y-8">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className={cn(
              "rounded-3xl overflow-hidden shadow-2xl border-2 transition-all duration-500",
              isTv ? "border-brand/30" : "border-white/10"
            )}
          >
            <img
              src={getImageUrl(media.poster_path, 'original')}
              alt={title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </motion.div>

          {/* Stats Card */}
          <div className="glass-card p-6 space-y-6 border border-white/5">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Info className="w-5 h-5 text-brand" />
              Details & Info
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm flex items-center gap-2">
                  <Globe className="w-4 h-4" /> Language
                </span>
                <span className="text-sm font-medium uppercase">{media.original_language || 'EN'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" /> Status
                </span>
                <span className={cn(
                  "text-sm font-bold",
                  media.status === 'Released' || media.status === 'Returning Series' ? 'text-green-500' : 'text-gray-400'
                )}>{media.status}</span>
              </div>

              {isTv ? (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm flex items-center gap-2">
                      <Hash className="w-4 h-4" /> Seasons
                    </span>
                    <span className="text-sm font-medium">{(media as any).number_of_seasons}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm flex items-center gap-2">
                      <Users className="w-4 h-4" /> Network
                    </span>
                    <span className="text-sm font-medium">{(media as any).networks?.[0]?.name || 'N/A'}</span>
                  </div>
                </>
              ) : (
                <>
                  {(media as any).budget > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm flex items-center gap-2">
                        <DollarSign className="w-4 h-4" /> Budget
                      </span>
                      <span className="text-sm font-medium">{formatCurrency((media as any).budget)}</span>
                    </div>
                  )}
                  {(media as any).revenue > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" /> Revenue
                      </span>
                      <span className="text-sm font-medium">{formatCurrency((media as any).revenue)}</span>
                    </div>
                  )}
                </>
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
                <span className="text-sm font-bold">{media.vote_average.toFixed(1)}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Clock className="w-4 h-4" />
                {isTv ? `${(media as any).number_of_episodes} Episodes` : `${(media as any).runtime} min`}
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Calendar className="w-4 h-4" />
                {releaseDate?.split('-')[0]}
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight tracking-tighter uppercase">{title}</h1>
            {media.tagline && <p className="text-brand text-lg font-medium italic mb-6">"{media.tagline}"</p>}

            <div className="flex flex-wrap gap-2 mb-8">
              {media.genres.map((genre: { id: number; name: string }) => (
                <span
                  key={genre.id}
                  className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs font-bold text-gray-400 uppercase tracking-widest hover:border-brand/50 hover:text-white transition-colors cursor-default"
                >
                  {genre.name}
                </span>
              ))}
            </div>

            <p className="text-gray-300 text-lg leading-relaxed mb-10 max-w-3xl">
              {media.overview}
            </p>

            <div className="flex flex-wrap items-center gap-4 mb-12">
              <button className="btn-primary px-10 py-4 text-lg shadow-xl shadow-brand/20">
                <Play className="fill-current w-5 h-5" />
                {isTv ? 'Watch Latest' : 'Watch Now'}
              </button>
              <button
                onClick={() => (isAdded ? removeFromWatchlist(media.id) : addToWatchlist(media))}
                className={cn(
                  'btn-secondary px-10 py-4 text-lg backdrop-blur-md',
                  isAdded && 'bg-brand/20 border-brand text-brand shadow-lg shadow-brand/10'
                )}
              >
                {isAdded ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                {isAdded ? 'In Watchlist' : 'Add to Watchlist'}
              </button>
            </div>

            {/* Provider Section */}
            {usProviders && (usProviders.flatrate || usProviders.rent || usProviders.buy) && (
              <div className="mb-16 bg-white/5 border border-white/5 p-8 rounded-3xl">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <span className="w-1 h-6 bg-brand rounded-full" />
                  Streaming Availability
                </h2>
                <div className="flex flex-wrap gap-12">
                  {usProviders.flatrate && (
                    <div className="space-y-4">
                      <p className="text-[10px] font-black text-brand uppercase tracking-[0.2em] opacity-80">Stream Free</p>
                      <div className="flex gap-4">
                        {usProviders.flatrate.map((p: any) => (
                          <div key={p.provider_id} title={p.provider_name} className="w-14 h-14 rounded-2xl overflow-hidden border border-white/10 hover:border-brand/50 transition-all hover:scale-110">
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
                  className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-brand transition-colors mt-8 uppercase tracking-widest"
                >
                  View all platforms <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            )}

            {/* TV SHOW SECTIONS */}
            {isTv && (media as any).seasons && (
              <div className="mb-16">
                <TvSeasonSelector tvId={id!} seasons={(media as any).seasons} />
              </div>
            )}

            {/* Trailer */}
            {trailer && (
              <div className="mb-16">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <span className="w-1 h-6 bg-brand rounded-full" />
                  Official {isTv ? 'Preview' : 'Trailer'}
                </h2>
                <div className="aspect-video w-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-black">
                  <iframe
                    src={`https://www.youtube.com/embed/${trailer.key}?controls=1&rel=0&showinfo=0`}
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
                  Featured Cast
                </h2>
                <div className="flex overflow-x-auto gap-8 pb-6 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
                  {cast.slice(0, 12).map((person) => (
                    <Link 
                      key={person.id} 
                      to={`/person/${person.id}`}
                      className="min-w-[120px] text-center group"
                    >
                      <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-2 border-white/10 group-hover:border-brand group-hover:scale-110 transition-all duration-300 mb-4 shadow-xl">
                        <img
                          src={getImageUrl(person.profile_path)}
                          alt={person.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <p className="text-sm font-bold text-white line-clamp-1 group-hover:text-brand transition-colors tracking-tight">{person.name}</p>
                      <p className="text-xs text-gray-500 line-clamp-1 font-medium">{person.character}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Similar Content */}
            {similar && similar.length > 0 && (
              <div className="mb-16 -mx-4 md:-mx-0">
                <MovieRow 
                  title={isTv ? "Recommended Shows" : "Related Movies"} 
                  movies={similar} 
                  className="py-0"
                  category="trending"
                />
              </div>
            )}

            <CategoryGrid />

            {/* Notice */}
            <div className="mt-20 p-8 rounded-3xl bg-white/5 border border-white/5 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
              <div className="p-4 bg-brand/10 rounded-2xl flex-shrink-0">
                <Globe className="w-8 h-8 text-brand" />
              </div>
              <div>
                <h4 className="font-bold text-white text-lg mb-2 capitalize tracking-tight">Streamora Intelligence</h4>
                <p className="text-gray-400 leading-relaxed text-sm">
                  Powered by TMDB. This platform provides real-time streaming data, official trailers, and comprehensive cast details. 
                  All visual assets are property of their respective owners.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};
