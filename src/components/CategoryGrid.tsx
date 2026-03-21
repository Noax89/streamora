import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutGrid, ChevronRight } from 'lucide-react';
import { useGenres } from '../hooks/useMovies';

export const CategoryGrid = () => {
  const { data: genres, isLoading } = useGenres();

  if (isLoading || !genres || genres.length === 0) return null;

  return (
    <div className="py-12 px-4 md:px-12 max-w-7xl mx-auto">
      <h2 className="text-2xl md:text-3xl font-bold mb-8 flex items-center gap-3">
        <LayoutGrid className="w-7 h-7 text-brand" />
        Explore Categories
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {genres.map((genre) => (
          <Link
            key={genre.id}
            to={`/category/${genre.id}`}
            className="flex items-center justify-between p-5 bg-white/5 border border-white/10 rounded-2xl hover:bg-brand/10 hover:border-brand/50 transition-all group shadow-sm hover:shadow-brand/20"
          >
            <span className="font-bold text-gray-300 group-hover:text-white transition-colors">
              {genre.name}
            </span>
            <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-brand group-hover:translate-x-1 transition-all" />
          </Link>
        ))}
      </div>
    </div>
  );
};
