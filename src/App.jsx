import React from 'react';
import AnimatedBackground from './components/AnimatedBackground';
import MatrixRain from './components/MatrixRain';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import MoviesSection from './components/MoviesSection';
import InfoSections from './components/InfoSections';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* Matrix Rain Effect */}
      <MatrixRain />
      
      {/* Animated 3D Background */}
      <AnimatedBackground />
      
      {/* Header */}
      <Header />
      
      {/* Main Content */}
      <main className="relative z-20">
        {/* Hero Section */}
        <HeroSection />
        
        {/* Movies Section */}
        <MoviesSection />
        
        {/* Info Sections */}
        <InfoSections />
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
