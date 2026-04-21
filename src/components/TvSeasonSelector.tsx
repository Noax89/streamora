import React, { useState } from 'react';
import { useTvSeasonDetails } from '../hooks/useMovies';
import { getImageUrl, tmdbApi } from '../services/tmdb';
import { Play, ChevronDown, ChevronUp, Youtube, Clock, Star, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils/cn';

interface TvSeasonSelectorProps {
  tvId: string;
  seasons: { season_number: number; name: string }[];
}

export const TvSeasonSelector = ({ tvId, seasons }: TvSeasonSelectorProps) => {
  const [selectedSeason, setSelectedSeason] = useState(seasons[0]?.season_number || 1);
  const { data: seasonDetails, isLoading } = useTvSeasonDetails(tvId, selectedSeason);

  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
  const [loadingVideo, setLoadingVideo] = useState<number | null>(null);

  const handlePlayEpisode = async (episodeNumber: number) => {
    setLoadingVideo(episodeNumber);
    try {
      const { data } = await tmdbApi.get(`/tv/${tvId}/season/${selectedSeason}/episode/${episodeNumber}/videos`);
      const trailer = data.results.find((v: any) => 
        (v.type === 'Trailer' || v.type === 'Teaser' || v.type === 'Clip') && v.site === 'YouTube'
      ) || data.results[0];
      
      if (trailer?.key) {
        setPlayingVideo(trailer.key);
      } else {
        alert('No visual preview available for this episode.');
      }
    } catch (error) {
      console.error('Error fetching episode video:', error);
    } finally {
      setLoadingVideo(null);
    }
  };

  return (
    <div className="space-y-8 mt-12 pt-12 border-t border-white/5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <span className="w-1 h-6 bg-brand rounded-full" />
          Seasons & Episodes
        </h2>
        
        <select
          value={selectedSeason}
          onChange={(e) => setSelectedSeason(Number(e.target.value))}
          className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm font-bold focus:outline-none focus:border-brand transition-colors cursor-pointer"
        >
          {seasons.map((s) => (
            <option key={s.season_number} value={s.season_number} className="bg-surface">
              {s.name}
            </option>
          ))}
        </select>
      </div>

      <AnimatePresence mode="wait">
        {playingVideo && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/90 backdrop-blur-xl"
          >
            <div className="relative w-full max-w-6xl aspect-video rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${playingVideo}?autoplay=1`}
                className="w-full h-full"
                allowFullScreen
                allow="autoplay"
              />
              <button
                onClick={() => setPlayingVideo(null)}
                className="absolute top-4 right-4 p-3 bg-black/60 rounded-full hover:bg-brand transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 gap-4">
        {isLoading ? (
          [...Array(5)].map((_, i) => (
            <div key={i} className="h-32 bg-white/5 rounded-2xl animate-shimmer" />
          ))
        ) : (
          seasonDetails?.episodes.map((episode) => (
            <motion.div
              key={episode.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="group bg-white/5 border border-white/5 rounded-2xl overflow-hidden hover:bg-white/10 hover:border-white/10 transition-all"
            >
              <div className="flex flex-col md:flex-row md:items-center gap-6 p-4 md:p-6">
                <div className="relative w-full md:w-48 aspect-video rounded-xl overflow-hidden flex-shrink-0 bg-surface-light">
                  <img
                    src={getImageUrl(episode.still_path)}
                    alt={episode.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <button
                    onClick={() => handlePlayEpisode(episode.episode_number)}
                    className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    {loadingVideo === episode.episode_number ? (
                      <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <div className="w-12 h-12 bg-brand rounded-full flex items-center justify-center shadow-xl">
                        <Play className="fill-white w-5 h-5 ml-1" />
                      </div>
                    )}
                  </button>
                </div>

                <div className="flex-grow min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-brand font-black text-sm uppercase tracking-tighter">
                      E{episode.episode_number}
                    </span>
                    <h3 className="text-lg font-bold text-white truncate">{episode.name}</h3>
                  </div>
                  <p className="text-gray-400 text-sm line-clamp-2 md:line-clamp-3 mb-3">
                    {episode.overview || "No overview available for this episode."}
                  </p>
                  <div className="flex items-center gap-4 text-xs font-bold text-gray-500 uppercase tracking-widest">
                    <div className="flex items-center gap-1.5">
                      <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                      {episode.vote_average.toFixed(1)}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3" />
                      {episode.air_date}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};
