import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Movie } from '../services/tmdb';

interface WatchlistState {
  watchlist: Movie[];
  addToWatchlist: (movie: Movie) => void;
  removeFromWatchlist: (movieId: number) => void;
  isInWatchlist: (movieId: number) => boolean;
}

export const useWatchlistStore = create<WatchlistState>()(
  persist(
    (set, get) => ({
      watchlist: [],
      addToWatchlist: (movie) => {
        const { watchlist } = get();
        if (!watchlist.find((m) => m.id === movie.id)) {
          set({ watchlist: [...watchlist, movie] });
        }
      },
      removeFromWatchlist: (movieId) => {
        set({
          watchlist: get().watchlist.filter((m) => m.id !== movieId),
        });
      },
      isInWatchlist: (movieId) => {
        return get().watchlist.some((m) => m.id === movieId);
      },
    }),
    {
      name: 'streamora-watchlist',
    }
  )
);
