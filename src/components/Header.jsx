import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Menu, X } from 'lucide-react';

export default function Header({ onAdminClick }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Inicio', href: '#home' },
    { name: 'Películas', href: '#movies' },
    { name: 'Series', href: '#series' },
    { name: 'Documentales', href: '#documentales' },
    { name: 'Mi Lista', href: '#lista' },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-black/95 backdrop-blur-md shadow-lg' 
          : 'bg-gradient-to-b from-black/80 to-transparent'
      }`}
      style={{ zIndex: 100 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-3 items-center h-20 md:h-24">
          {/* Logo - Left */}
          <div className="flex items-center space-x-3 justify-self-start">
            <motion.div
              whileHover={{ 
                scale: 1.1,
                textShadow: "0 0 20px rgba(229, 9, 20, 0.8)"
              }}
              className="flex items-center space-x-3"
            >
              <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-r from-netflix-red to-red-600 rounded-lg flex items-center justify-center shadow-lg matrix-glow">
                <Play className="w-6 h-6 md:w-7 md:h-7 text-white fill-white" />
              </div>
              <span className="text-2xl md:text-4xl font-bold gradient-text glow-text" style={{letterSpacing: '2px'}}>
                StreamFlix
              </span>
            </motion.div>
            
            {/* Admin Access Button */}
            {onAdminClick && (
              <motion.button
                onClick={onAdminClick}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="ml-4 w-8 h-8 bg-gray-800 hover:bg-red-600 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-colors opacity-70 hover:opacity-100"
                title="Panel de Administración"
              >
                <div className="w-3 h-3 border border-current rounded-sm"></div>
              </motion.button>
            )}
          </div>

          {/* Desktop Navigation - Center */}
          <nav className="hidden md:flex items-center justify-center">
            <div className="flex items-center space-x-12 lg:space-x-16 xl:space-x-20">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  <motion.a
                    href={item.href}
                    whileHover={{ 
                      scale: 1.2,
                      y: -5
                    }}
                    className="block text-white hover:text-green-400 transition-all duration-500 font-bold text-xl lg:text-2xl xl:text-3xl cursor-pointer px-6 py-3 rounded-lg"
                    style={{
                      textShadow: "3px 3px 6px rgba(0,0,0,0.9)",
                      letterSpacing: "2px",
                      minWidth: "140px",
                      textAlign: "center",
                      textDecoration: "none"
                    }}
                  >
                    <motion.span
                      whileHover={{
                        textShadow: [
                          "0 0 10px rgba(229, 9, 20, 0.9)",
                          "0 0 20px rgba(255, 255, 0, 0.9)",
                          "0 0 30px rgba(0, 255, 0, 0.9)",
                          "0 0 20px rgba(229, 9, 20, 0.9)"
                        ]
                      }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      {item.name}
                    </motion.span>
                  </motion.a>
                  
                  {/* Glow effect behind text */}
                  <motion.div
                    className="absolute inset-0 pointer-events-none rounded-lg"
                    whileHover={{
                      background: [
                        "linear-gradient(45deg, rgba(229, 9, 20, 0.2) 0%, transparent 100%)",
                        "linear-gradient(45deg, rgba(255, 255, 0, 0.2) 0%, transparent 100%)",
                        "linear-gradient(45deg, rgba(0, 255, 0, 0.2) 0%, transparent 100%)"
                      ],
                      boxShadow: [
                        "0 0 20px rgba(229, 9, 20, 0.3)",
                        "0 0 20px rgba(255, 255, 0, 0.3)",
                        "0 0 20px rgba(0, 255, 0, 0.3)"
                      ]
                    }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                  />
                </motion.div>
              ))}
            </div>
          </nav>

          {/* Mobile Menu Button - Right */}
          <div className="md:hidden justify-self-end">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-3 text-gray-300 hover:text-white transition-colors duration-200"
            >
              {isMobileMenuOpen ? (
                <X className="w-8 h-8" />
              ) : (
                <Menu className="w-8 h-8" />
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-enhanced border-t border-netflix-red/30"
          >
            <div className="px-6 py-6 space-y-4">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  <motion.a
                    href={item.href}
                    whileHover={{ 
                      scale: 1.05,
                      x: 10
                    }}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-5 px-6 text-white hover:text-netflix-red font-bold text-xl rounded-xl transition-all duration-300 border-2 border-transparent hover:border-netflix-red/50 hover:bg-netflix-red/20 text-center"
                    style={{
                      textShadow: "2px 2px 4px rgba(0,0,0,0.9)",
                      letterSpacing: "2px",
                      textDecoration: "none",
                      minHeight: "60px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    {item.name}
                  </motion.a>
                  
                  {/* Separator line */}
                  {index < navItems.length - 1 && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-netflix-red/50 to-transparent mt-2" />
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}