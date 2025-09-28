import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import AnimatedBackground from './components/AnimatedBackground';
import MatrixRain from './components/MatrixRain';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import MoviesSection from './components/MoviesSection';
import InfoSections from './components/InfoSections';
import Footer from './components/Footer';
import LoginPage from './components/admin/LoginPage';
import Dashboard from './components/admin/Dashboard';

// Componente principal de la aplicación
function StreamFlixApp() {
  const { user, loading } = useAuth();
  const [showAdmin, setShowAdmin] = useState(false);

  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Cargando StreamFlix...</p>
        </div>
      </div>
    );
  }

  // Si el usuario está autenticado como admin, mostrar dashboard
  if (user) {
    return <Dashboard />;
  }

  // Si se solicita mostrar admin pero no está autenticado, mostrar login
  if (showAdmin) {
    return <LoginPage />;
  }

  // Mostrar la aplicación principal de streaming
  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* Matrix Rain Effect */}
      <MatrixRain />
      
      {/* Animated 3D Background */}
      <AnimatedBackground />
      
      {/* Header con botón de admin */}
      <Header onAdminClick={() => setShowAdmin(true)} />
      
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

// Componente wrapper con el AuthProvider
function App() {
  return (
    <AuthProvider>
      <StreamFlixApp />
    </AuthProvider>
  );
}

export default App;
