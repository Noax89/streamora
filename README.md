# 🎬 STREAMORA — Premium Movie Streaming Experience

Streamora is a high-performance, production-grade movie discovery and streaming platform built with **React 19**, **TypeScript**, and **Tailwind CSS**. It leverages the **TMDB API** to provide real-time movie data, trailers, and personalized watchlists with a cinematic user interface.

![Streamora Preview](https://streamora-teal.vercel.app)

## Link
https://streamora-teal.vercel.app 

## 🚀 Key Features

- **Dynamic Hero Section:** Featured trending movies with high-quality backdrops and quick-action buttons.
- **Categorized Movie Rows:** Trending, Popular, Top Rated, and Upcoming releases with smooth horizontal scrolling.
- **Inline Trailer Player:** Watch official YouTube trailers directly on the home page without redirection.
- **Advanced Search:** Real-time movie search with instant results and debounced API calls.
- **Personalized Watchlist:** Save your favorite movies to a persistent local watchlist managed via **Zustand**.
- **Detailed Movie Insights:** Comprehensive details including cast, similar movies, budget, revenue, and where to watch (streaming providers).
- **Genre Exploration:** Browse movies by categories like Action, Comedy, Horror, and more.
- **Responsive Design:** Fully optimized for Mobile, Tablet, and Desktop with a mobile-first approach.

## 🛠️ Tech Stack

### Frontend
- **React 19:** Utilizing the latest features for optimal performance and component architecture.
- **TypeScript:** Ensuring end-to-end type safety and developer productivity.
- **Tailwind CSS 4:** Utility-first styling with a custom theme and modern design system.
- **Framer Motion:** Fluid transitions, entrance animations, and interactive UI elements.
- **Lucide React:** A consistent and crisp SVG icon library.

### State & Data Management
- **TanStack React Query (v5):** Advanced data fetching, caching, and synchronization with the TMDB API.
- **Zustand:** Lightweight and scalable state management for the user's watchlist.
- **Axios:** Robust HTTP client for API communication with interceptors and error handling.

### Routing & Build Tools
- **React Router Dom (v7):** Declarative routing for a seamless Single Page Application (SPA) experience.
- **Vite:** Next-generation frontend tooling for lightning-fast development and optimized production builds.

## ⚡ Optimizations & Best Practices

- **API Caching:** Implemented `staleTime` and `gcTime` in React Query to minimize redundant network requests and improve perceived performance.
- **Lazy Loading:** Images are loaded with `loading="lazy"` and `referrerPolicy="no-referrer"` for security and speed.
- **Debounced Search:** Search queries are debounced to prevent API rate limiting and ensure a smooth typing experience.
- **Component Modularization:** Clean separation of concerns with reusable components (e.g., `MovieRow`, `MovieCard`, `CategoryGrid`).
- **Custom Hooks:** Logic abstraction for data fetching (`useMovies`, `useMovieDetails`) and state management.
- **Accessibility (a11y):** Semantic HTML, descriptive alt tags, and high-contrast color palettes.
- **Performance:** Minimized re-renders by stabilizing dependency arrays in `useEffect` and using memoized components where necessary.

## 📂 Project Structure

```text
src/
├── components/     # Reusable UI components (Hero, MovieRow, TrailerSection, etc.)
├── hooks/          # Custom React hooks for API calls and logic
├── pages/          # Page-level components (Home, MovieDetails, Search, Watchlist)
├── services/       # TMDB API configuration and Axios instance
├── store/          # Zustand store for global state (Watchlist)
├── utils/          # Helper functions and styling utilities
├── App.tsx         # Main application entry point and routing
└── main.tsx        # React DOM rendering
```

## 🛠️ Development Tools

- **ESLint:** Enforcing code quality and consistent coding standards.
- **TypeScript Compiler (tsc):** Static type checking to catch errors before runtime.
- **Vite Dev Server:** Hot Module Replacement (HMR) for instant feedback during development.
- **PostCSS:** Autoprefixer and modern CSS features processing.

## 🚦 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- TMDB API Key (Get one at [themoviedb.org](https://www.themoviedb.org/documentation/api))

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/streamora.git
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory:
   ```env
   VITE_TMDB_API_KEY=your_api_key_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

*Data provided by [The Movie Database (TMDB)](https://www.themoviedb.org).*
