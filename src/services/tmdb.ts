import axios from 'axios';

const TMDB_API_KEY = process.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export const tmdbApi = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: TMDB_API_KEY,
  },
});

export const getImageUrl = (path: string, size: 'original' | 'w500' = 'w500') => 
  path ? `${IMAGE_BASE_URL}/${size}${path}` : 'https://via.placeholder.com/500x750?text=No+Image';

export const endpoints = {
  trending: '/trending/movie/week',
  popular: '/movie/popular',
  topRated: '/movie/top_rated',
  upcoming: '/movie/upcoming',
  movieDetails: (id: string) => `/movie/${id}`,
  movieVideos: (id: string) => `/movie/${id}/videos`,
  movieCredits: (id: string) => `/movie/${id}/credits`,
  similarMovies: (id: string) => `/movie/${id}/similar`,
  watchProviders: (id: string) => `/movie/${id}/watch/providers`,
  search: '/search/movie',
  genres: '/genre/movie/list',
  personDetails: (id: string) => `/person/${id}`,
  personMovieCredits: (id: string) => `/person/${id}/movie_credits`,
  upcomingMovies: '/movie/upcoming',
  nowPlaying: '/movie/now_playing',
  discover: '/discover/movie',
};

export interface Genre {
  id: number;
  name: string;
}

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
}

export interface PersonDetails {
  id: number;
  name: string;
  biography: string;
  birthday: string;
  place_of_birth: string;
  profile_path: string;
  known_for_department: string;
  also_known_as: string[];
}

export interface PersonMovieCredits {
  cast: Movie[];
}

export interface MovieDetails extends Movie {
  genres: { id: number; name: string }[];
  runtime: number;
  tagline: string;
  budget: number;
  revenue: number;
  status: string;
  original_language: string;
}

export interface WatchProvider {
  provider_id: number;
  provider_name: string;
  logo_path: string;
}

export interface WatchProvidersResponse {
  results: {
    [countryCode: string]: {
      link: string;
      flatrate?: WatchProvider[];
      rent?: WatchProvider[];
      buy?: WatchProvider[];
    };
  };
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
}

export interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string;
}
