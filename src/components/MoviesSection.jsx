import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, Plus, Star } from 'lucide-react';

// Datos de películas de ejemplo
const movieCategories = {
  trending: {
    title: "Tendencias Ahora",
    movies: [
      { id: 1, title: "Avatar: El Camino del Agua", rating: 8.2, year: 2022, genre: "Ciencia Ficción", image: "https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg" },
      { id: 2, title: "Top Gun: Maverick", rating: 8.7, year: 2022, genre: "Acción", image: "https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17ljH.jpg" },
      { id: 3, title: "Stranger Things 4", rating: 8.9, year: 2022, genre: "Drama/Terror", image: "https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg" },
      { id: 4, title: "Black Panther: Wakanda Forever", rating: 7.3, year: 2022, genre: "Superhéroes", image: "https://image.tmdb.org/t/p/w500/sv1xJUazXeYqALzczSZ3O6nkH75.jpg" },
      { id: 5, title: "The Batman", rating: 8.1, year: 2022, genre: "Acción/Drama", image: "https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg" },
    ]
  },
  action: {
    title: "Películas de Acción",
    movies: [
      { id: 6, title: "John Wick 4", rating: 8.4, year: 2023, genre: "Acción", image: "https://image.tmdb.org/t/p/w500/vZloFAK7NmvMGKE7VkF5UHaz0I.jpg" },
      { id: 7, title: "Fast X", rating: 6.2, year: 2023, genre: "Acción", image: "https://image.tmdb.org/t/p/w500/fiVW06jE7z9YnO4trhaMEdclSiC.jpg" },
      { id: 8, title: "Mission Impossible 7", rating: 8.0, year: 2023, genre: "Acción", image: "https://image.tmdb.org/t/p/w500/NNxYkU70HPurnNCSiCjYAmacwm.jpg" },
      { id: 9, title: "Guardians of the Galaxy 3", rating: 8.3, year: 2023, genre: "Aventura", image: "https://image.tmdb.org/t/p/w500/r2J02Z2OpNTctfOSN1Ydgii51I3.jpg" },
      { id: 10, title: "Indiana Jones 5", rating: 7.1, year: 2023, genre: "Aventura", image: "https://image.tmdb.org/t/p/w500/Af4bXE63pVsb2FtbW8uYIyPBadD.jpg" },
    ]
  },
  series: {
    title: "Series Populares",
    movies: [
      { id: 11, title: "The Last of Us", rating: 9.1, year: 2023, genre: "Drama/Terror", image: "https://image.tmdb.org/t/p/w500/uKvVjHNqB5VmOrdxqAt2F7J78ED.jpg" },
      { id: 12, title: "Wednesday", rating: 8.2, year: 2022, genre: "Comedia/Terror", image: "https://image.tmdb.org/t/p/w500/9PFonBhy4cQy7Jz20NpMygczOkv.jpg" },
      { id: 13, title: "House of the Dragon", rating: 8.4, year: 2022, genre: "Drama/Fantasía", image: "https://image.tmdb.org/t/p/w500/7QMsOTMUswlwxJP0rTTZfmz2tX2.jpg" },
      { id: 14, title: "The Bear", rating: 8.7, year: 2022, genre: "Comedia/Drama", image: "https://image.tmdb.org/t/p/w500/zPyj6qD5qK565ZyeSyYQbaj2nGZ.jpg" },
      { id: 15, title: "Euphoria", rating: 8.4, year: 2022, genre: "Drama", image: "https://image.tmdb.org/t/p/w500/jtnfNzqZwN4E32FGGxx1YZaBWWf.jpg" },
    ]
  }
};

function MovieCard({ movie, isHovered, onHover, onLeave }) {
  return (
    <motion.div
      className="relative min-w-[200px] md:min-w-[250px] lg:min-w-[300px] h-[150px] md:h-[180px] lg:h-[200px] movie-card cursor-pointer"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative w-full h-full rounded-lg overflow-hidden group">
        {/* Movie Image */}
        <img
          src={movie.image}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          onError={(e) => {
            e.target.src = `https://via.placeholder.com/300x200/1a1a1a/ffffff?text=${encodeURIComponent(movie.title)}`;
          }}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Movie Info Overlay */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute inset-0 p-4 flex flex-col justify-end"
            >
              <div className="space-y-2">
                <h3 className="text-white font-semibold text-sm md:text-base line-clamp-2">
                  {movie.title}
                </h3>
                
                <div className="flex items-center space-x-2 text-xs md:text-sm">
                  <div className="flex items-center space-x-1 text-yellow-400">
                    <Star className="w-3 h-3 fill-current" />
                    <span>{movie.rating}</span>
                  </div>
                  <span className="text-gray-300">•</span>
                  <span className="text-gray-300">{movie.year}</span>
                  <span className="text-gray-300">•</span>
                  <span className="text-gray-300 text-xs">{movie.genre}</span>
                </div>
                
                <div className="flex space-x-2 mt-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="flex items-center space-x-1 bg-white text-black px-3 py-1 rounded text-xs font-semibold hover:bg-gray-200 transition-colors"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Play</span>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="flex items-center space-x-1 bg-gray-800/80 text-white px-3 py-1 rounded text-xs hover:bg-gray-700 transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Lista</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function MovieCarousel({ category, movies }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hoveredMovie, setHoveredMovie] = useState(null);
  const scrollRef = useRef(null);
  
  const itemsPerView = 4;
  const maxIndex = Math.max(0, movies.length - itemsPerView);

  const scroll = (direction) => {
    const newIndex = direction === 'left' 
      ? Math.max(0, currentIndex - 1)
      : Math.min(maxIndex, currentIndex + 1);
    
    setCurrentIndex(newIndex);
    
    if (scrollRef.current) {
      const itemWidth = scrollRef.current.scrollWidth / movies.length;
      scrollRef.current.scrollTo({
        left: newIndex * itemWidth,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-white">
          {category}
        </h2>
        
        <div className="flex space-x-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => scroll('left')}
            disabled={currentIndex === 0}
            className="p-2 bg-gray-800/80 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-full transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => scroll('right')}
            disabled={currentIndex >= maxIndex}
            className="p-2 bg-gray-800/80 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-full transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </motion.button>
        </div>
      </div>
      
      <div 
        ref={scrollRef}
        className="flex space-x-4 overflow-x-auto scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            isHovered={hoveredMovie === movie.id}
            onHover={() => setHoveredMovie(movie.id)}
            onLeave={() => setHoveredMovie(null)}
          />
        ))}
      </div>
    </div>
  );
}

export default function MoviesSection() {
  return (
    <section id="movies" className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {Object.entries(movieCategories).map(([key, category]) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <MovieCarousel category={category.title} movies={category.movies} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}