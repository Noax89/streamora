import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Calendar, MapPin, User, Info, Film } from 'lucide-react';
import { usePersonDetails, usePersonMovieCredits } from '../hooks/useMovies';
import { getImageUrl } from '../services/tmdb';
import { MovieRow } from '../components/MovieRow';

export const PersonDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { data: person, isLoading } = usePersonDetails(id!);
  const { data: movies, isLoading: moviesLoading } = usePersonMovieCredits(id!);

  if (isLoading || !person) {
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
      <div className="max-w-7xl mx-auto">
        <Link
          to={-1 as any}
          className="inline-flex items-center gap-2 text-gray-400 hover:text-brand transition-colors mb-12 group"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left: Profile Image & Info */}
          <div className="space-y-8">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="rounded-2xl overflow-hidden shadow-2xl border border-white/10 aspect-2/3"
            >
              <img
                src={getImageUrl(person.profile_path, 'original')}
                alt={person.name}
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
              />
            </motion.div>

            <div className="glass-card p-6 space-y-6">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Info className="w-5 h-5 text-brand" />
                Personal Info
              </h3>
              
              <div className="space-y-4">
                <div className="flex flex-col gap-1">
                  <span className="text-gray-400 text-xs uppercase tracking-widest font-bold">Known For</span>
                  <span className="text-sm font-medium">{person.known_for_department}</span>
                </div>
                
                {person.birthday && (
                  <div className="flex flex-col gap-1">
                    <span className="text-gray-400 text-xs uppercase tracking-widest font-bold">Birthday</span>
                    <span className="text-sm font-medium flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-brand" />
                      {person.birthday}
                    </span>
                  </div>
                )}

                {person.place_of_birth && (
                  <div className="flex flex-col gap-1">
                    <span className="text-gray-400 text-xs uppercase tracking-widest font-bold">Place of Birth</span>
                    <span className="text-sm font-medium flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-brand" />
                      {person.place_of_birth}
                    </span>
                  </div>
                )}

                {person.also_known_as && person.also_known_as.length > 0 && (
                  <div className="flex flex-col gap-1">
                    <span className="text-gray-400 text-xs uppercase tracking-widest font-bold">Also Known As</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {person.also_known_as.slice(0, 3).map((name: string) => (
                        <span key={name} className="text-xs bg-white/5 px-2 py-1 rounded border border-white/10">
                          {name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: Biography & Filmography */}
          <div className="lg:col-span-2 space-y-12">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-6">{person.name}</h1>
              
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <span className="w-1 h-6 bg-brand rounded-full" />
                  Biography
                </h2>
                <p className="text-gray-300 text-lg leading-relaxed whitespace-pre-wrap">
                  {person.biography || `We don't have a biography for ${person.name} yet.`}
                </p>
              </div>

              {/* Filmography */}
              <div className="-mx-4 md:mx-0">
                <MovieRow 
                  title="Known For" 
                  movies={movies?.sort((a, b) => b.vote_average - a.vote_average).slice(0, 20) || []} 
                  isLoading={moviesLoading}
                  className="py-0"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
