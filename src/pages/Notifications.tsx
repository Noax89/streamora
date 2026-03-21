import React from 'react';
import { motion } from 'framer-motion';
import { Bell, Film, Play, Star, Calendar, ChevronRight, Info } from 'lucide-react';
import { useUpcomingMovies, useNowPlayingMovies } from '../hooks/useMovies';
import { getImageUrl } from '../services/tmdb';
import { Link } from 'react-router-dom';
import { cn } from '../utils/cn';
import { Movie } from '../services/tmdb';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  movie?: Movie;
  date: string;
  icon: React.ReactNode;
}

export const Notifications = () => {
  const { data: upcoming, isLoading: upcomingLoading } = useUpcomingMovies();
  const { data: nowPlaying, isLoading: nowPlayingLoading } = useNowPlayingMovies();

  const isLoading = upcomingLoading || nowPlayingLoading;

  // Combine and format notifications
  const notifications: Notification[] = [
    ...(upcoming?.slice(0, 5).map(movie => ({
      id: `upcoming-${movie.id}`,
      type: 'upcoming',
      title: 'Upcoming Release',
      message: `"${movie.title}" is coming soon! Mark your calendar for ${movie.release_date}.`,
      movie,
      date: new Date().toISOString(),
      icon: <Calendar className="w-5 h-5 text-blue-500" />
    })) || []),
    ...(nowPlaying?.slice(0, 5).map(movie => ({
      id: `now-${movie.id}`,
      type: 'now_playing',
      title: 'Now Playing',
      message: `"${movie.title}" is now in theaters. Watch the trailer now!`,
      movie,
      date: new Date(Date.now() - 3600000).toISOString(),
      icon: <Play className="w-5 h-5 text-brand" />
    })) || []),
    {
      id: 'system-1',
      type: 'system',
      title: 'Welcome to Streamora!',
      message: 'Start exploring thousands of movies and TV shows. Add them to your watchlist to keep track!',
      date: new Date(Date.now() - 86400000).toISOString(),
      icon: <Info className="w-5 h-5 text-brand" />
    }
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-surface pt-32 pb-20 px-4 md:px-12"
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <div className="bg-brand/10 p-3 rounded-2xl">
              <Bell className="w-8 h-8 text-brand" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Notifications</h1>
              <p className="text-gray-400 mt-1">Stay updated with the latest in cinema</p>
            </div>
          </div>
          <button className="text-sm text-brand hover:underline font-medium">
            Mark all as read
          </button>
        </div>

        <div className="space-y-4">
          {notifications.map((notification, index) => (
            <motion.div
              key={notification.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card p-6 flex gap-6 items-start group hover:bg-white/10 transition-colors cursor-pointer"
            >
              <div className="p-3 bg-white/5 rounded-xl shrink-0">
                {notification.icon}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-lg text-white group-hover:text-brand transition-colors">
                    {notification.title}
                  </h3>
                  <span className="text-xs text-gray-500">
                    {new Date(notification.date).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-400 leading-relaxed mb-4">
                  {notification.message}
                </p>

                {notification.movie && (
                  <Link
                    to={`/movie/${notification.movie.id}`}
                    className="flex items-center gap-4 p-3 bg-black/40 rounded-xl border border-white/5 hover:border-brand/50 transition-all"
                  >
                    <div className="w-12 h-16 rounded-lg overflow-hidden shrink-0">
                      <img
                        src={getImageUrl(notification.movie.poster_path)}
                        alt={notification.movie.title}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-white">{notification.movie.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Star className="w-3 h-3 text-yellow-500 fill-current" />
                        <span className="text-xs text-gray-400">{notification.movie.vote_average.toFixed(1)}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-brand transition-colors" />
                  </Link>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {notifications.length === 0 && (
          <div className="text-center py-20">
            <Bell className="w-16 h-16 text-gray-700 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-500">No notifications yet</h2>
            <p className="text-gray-600 mt-2">We'll let you know when something exciting happens!</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};
