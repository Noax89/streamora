import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { 
  tmdbApi, 
  endpoints, 
  Movie, 
  MovieDetails, 
  Video, 
  Cast, 
  Genre,
  TvShow,
  TvShowDetails,
  SeasonDetails
} from '../services/tmdb';

export const useMovies = (endpoint: string, params = {}) => {
  return useQuery({
    queryKey: ['movies', endpoint, params],
    queryFn: async () => {
      const { data } = await tmdbApi.get(endpoint, { params });
      return data.results as Movie[];
    },
  });
};

export const useInfiniteMovies = (endpoint: string, params = {}) => {
  return useInfiniteQuery({
    queryKey: ['movies-infinite', endpoint, params],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await tmdbApi.get(endpoint, {
        params: { ...params, page: pageParam },
      });
      return {
        results: data.results as Movie[],
        nextPage: pageParam < data.total_pages ? pageParam + 1 : undefined,
        totalPages: data.total_pages,
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
  });
};

export const useGenres = () => {
  return useQuery({
    queryKey: ['genres'],
    queryFn: async () => {
      const { data } = await tmdbApi.get(endpoints.genres);
      return data.genres as Genre[];
    },
  });
};

export const useTvGenres = () => {
  return useQuery({
    queryKey: ['tv-genres'],
    queryFn: async () => {
      const { data } = await tmdbApi.get(endpoints.tvGenres);
      return data.genres as Genre[];
    },
  });
};

export const useMoviesByGenre = (genreId: string) => {
  return useQuery({
    queryKey: ['movies-by-genre', genreId],
    queryFn: async () => {
      const { data } = await tmdbApi.get(endpoints.discover, {
        params: { with_genres: genreId },
      });
      return data.results as Movie[];
    },
    enabled: !!genreId,
  });
};

export const useInfiniteMoviesByGenre = (genreId: string) => {
  return useInfiniteQuery({
    queryKey: ['movies-by-genre-infinite', genreId],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await tmdbApi.get(endpoints.discover, {
        params: { with_genres: genreId, page: pageParam },
      });
      return {
        results: data.results as Movie[],
        nextPage: pageParam < data.total_pages ? pageParam + 1 : undefined,
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
    enabled: !!genreId,
  });
};

export const useInfiniteTvByGenre = (genreId: string) => {
  return useInfiniteQuery({
    queryKey: ['tv-by-genre-infinite', genreId],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await tmdbApi.get(endpoints.discoverTv, {
        params: { with_genres: genreId, page: pageParam },
      });
      return {
        results: data.results as TvShow[],
        nextPage: pageParam < data.total_pages ? pageParam + 1 : undefined,
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
    enabled: !!genreId,
  });
};

export const useMovieDetails = (id: string) => {
  return useQuery({
    queryKey: ['movie', id],
    queryFn: async () => {
      const { data } = await tmdbApi.get(endpoints.movieDetails(id));
      return data as MovieDetails;
    },
    enabled: !!id,
  });
};

export const useTvDetails = (id: string) => {
  return useQuery({
    queryKey: ['tv', id],
    queryFn: async () => {
      const { data } = await tmdbApi.get(endpoints.tvDetails(id));
      return data as TvShowDetails;
    },
    enabled: !!id,
  });
};

export const useTvSeasonDetails = (id: string, season: number) => {
  return useQuery({
    queryKey: ['tv-season', id, season],
    queryFn: async () => {
      const { data } = await tmdbApi.get(endpoints.tvSeason(id, season));
      return data as SeasonDetails;
    },
    enabled: !!id && season !== undefined,
  });
};

export const useTvEpisodeVideos = (id: string, season: number, episode: number) => {
  return useQuery({
    queryKey: ['tv-episode-videos', id, season, episode],
    queryFn: async () => {
      const { data } = await tmdbApi.get(endpoints.tvEpisodeVideos(id, season, episode));
      return data.results as Video[];
    },
    enabled: !!id && season !== undefined && episode !== undefined,
  });
};

export const useMovieVideos = (id: string) => {
  return useQuery({
    queryKey: ['movie-videos', id],
    queryFn: async () => {
      const { data } = await tmdbApi.get(endpoints.movieVideos(id));
      return data.results as Video[];
    },
    enabled: !!id,
  });
};

export const useTvVideos = (id: string) => {
  return useQuery({
    queryKey: ['tv-videos', id],
    queryFn: async () => {
      const { data } = await tmdbApi.get(endpoints.tvVideos(id));
      return data.results as Video[];
    },
    enabled: !!id,
  });
};

export const useMovieCredits = (id: string) => {
  return useQuery({
    queryKey: ['movie-credits', id],
    queryFn: async () => {
      const { data } = await tmdbApi.get(endpoints.movieCredits(id));
      return data.cast as Cast[];
    },
    enabled: !!id,
  });
};

export const useTvCredits = (id: string) => {
  return useQuery({
    queryKey: ['tv-credits', id],
    queryFn: async () => {
      const { data } = await tmdbApi.get(endpoints.tvCredits(id));
      return data.cast as Cast[];
    },
    enabled: !!id,
  });
};

export const useSimilarMovies = (id: string) => {
  return useQuery({
    queryKey: ['similar-movies', id],
    queryFn: async () => {
      const { data } = await tmdbApi.get(endpoints.similarMovies(id));
      return data.results as Movie[];
    },
    enabled: !!id,
  });
};

export const useWatchProviders = (id: string) => {
  return useQuery({
    queryKey: ['watch-providers', id],
    queryFn: async () => {
      const { data } = await tmdbApi.get(endpoints.watchProviders(id));
      return data.results as any;
    },
    enabled: !!id,
  });
};

export const usePersonDetails = (id: string) => {
  return useQuery({
    queryKey: ['person', id],
    queryFn: async () => {
      const { data } = await tmdbApi.get(endpoints.personDetails(id));
      return data as any;
    },
    enabled: !!id,
  });
};

export const usePersonMovieCredits = (id: string) => {
  return useQuery({
    queryKey: ['person-movies', id],
    queryFn: async () => {
      const { data } = await tmdbApi.get(endpoints.personMovieCredits(id));
      return data.cast as Movie[];
    },
    enabled: !!id,
  });
};

export const useUpcomingMovies = () => {
  return useQuery({
    queryKey: ['upcoming-movies'],
    queryFn: async () => {
      const { data } = await tmdbApi.get(endpoints.upcomingMovies);
      return data.results as Movie[];
    },
  });
};

export const useNowPlayingMovies = () => {
  return useQuery({
    queryKey: ['now-playing-movies'],
    queryFn: async () => {
      const { data } = await tmdbApi.get(endpoints.nowPlaying);
      return data.results as Movie[];
    },
  });
};

export const useSearchMovies = (query: string) => {
  return useQuery({
    queryKey: ['search', query],
    queryFn: async () => {
      if (!query) return [];
      const { data } = await tmdbApi.get(endpoints.search, {
        params: { query },
      });
      return data.results as Movie[];
    },
    enabled: !!query,
  });
};
