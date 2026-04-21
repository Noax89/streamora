import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LayoutGrid, ChevronRight, Film, Tv } from 'lucide-react';
import { useGenres, useTvGenres } from '../hooks/useMovies';
import { cn } from '../utils/cn';

export const CategoryGrid = () => {
  const [activeTab, setActiveTab] = useState<'movie' | 'tv'>('movie');
  const { data: movieGenres, isLoading: moviesLoading } = useGenres();
  const { data: tvGenres, isLoading: tvLoading } = useTvGenres();

  const isLoading = activeTab === 'movie' ? moviesLoading : tvLoading;
  const genres = activeTab === 'movie' ? movieGenres : tvGenres;

  if (isLoading || !genres || genres.length === 0) {
    if (isLoading) {
      return (
        <div className="py-12 px-4 md:px-12 max-w-7xl mx-auto">
          <div className="h-10 w-48 bg-surface-light rounded-md mb-8 animate-shimmer" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="h-16 bg-surface-light rounded-2xl animate-shimmer" />
            ))}
          </div>
        </div>
      );
    }
    return null;
  }

  return (
    <div className="py-12 px-4 md:px-12 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
          <LayoutGrid className="w-7 h-7 text-brand" />
          Explore Categories
        </h2>

        <div className="flex p-1 bg-white/5 backdrop-blur-md rounded-xl border border-white/10 self-start">
          <button
            onClick={() => setActiveTab('movie')}
            className={cn(
              "flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all",
              activeTab === 'movie' 
                ? "bg-brand text-white shadow-lg shadow-brand/20" 
                : "text-gray-400 hover:text-white"
            )}
          >
            <Film className="w-4 h-4" />
            Movies
          </button>
          <button
            onClick={() => setActiveTab('tv')}
            className={cn(
              "flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all",
              activeTab === 'tv' 
                ? "bg-brand text-white shadow-lg shadow-brand/20" 
                : "text-gray-400 hover:text-white"
            )}
          >
            <Tv className="w-4 h-4" />
            TV Shows
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {genres.map((genre) => (
          <Link
            key={genre.id}
            to={`/category/${activeTab}/${genre.id}`}
            className="flex items-center justify-between p-5 bg-white/5 border border-white/10 rounded-2xl hover:bg-brand/10 hover:border-brand/50 transition-all group shadow-sm hover:shadow-brand/20"
          >
            <span className="font-bold text-gray-300 group-hover:text-white transition-colors capitalize">
              {genre.name}
            </span>
            <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-brand group-hover:translate-x-1 transition-all" />
          </Link>
        ))}
      </div>
    </div>
  );
};
