import React, { useEffect, useRef } from 'react';

export default function MatrixRain() {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Configurar el canvas
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Configuración del Matrix - menos denso
    const matrixChars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    const fontSize = 20; // Mayor tamaño de fuente
    const columns = Math.floor(canvas.width / fontSize / 1.5); // Menos columnas
    const drops = [];
    
    // Inicializar las gotas
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.floor(Math.random() * canvas.height / fontSize);
    }
    
    const draw = () => {
      // Fondo con desvanecimiento moderado para mejor visibilidad
      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.font = `${fontSize}px monospace`;
      
      for (let i = 0; i < drops.length; i++) {
        // Colores un poco más brillantes para mejor visibilidad
        const colorChoice = Math.random();
        let color;
        if (colorChoice > 0.8) {
          color = '#b3b300'; // Amarillo más visible
        } else if (colorChoice > 0.6) {
          color = '#006600'; // Verde medio
        } else {
          color = '#004400'; // Verde oscuro pero visible
        }
        
        ctx.fillStyle = color;
        
        // Carácter aleatorio
        const char = matrixChars[Math.floor(Math.random() * matrixChars.length)];
        
        // Posición
        const x = i * fontSize;
        const y = drops[i] * fontSize;
        
        // Dibujar carácter con mejor intensidad
        ctx.globalAlpha = 0.8; // Aumentar la opacidad de cada carácter
        ctx.fillText(char, x, y);
        ctx.globalAlpha = 1.0; // Restaurar opacidad para el próximo frame
        
        // Reiniciar gota si llega al final
        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        
        drops[i]++;
      }
    };
    
    // Iniciar animación con velocidad balanceada
    const interval = setInterval(draw, 90);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);
  
  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 1 }}>
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          opacity: 0.32,
          width: '100%',
          height: '100%',
          filter: 'blur(0.3px)'
        }}
      />
    </div>
  );
}