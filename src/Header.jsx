import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

function Header() {
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const iconRef = useRef(null);

  // --- ANIMACIÓN DE ENTRADA (Intro) ---
  useEffect(() => {
    const tl = gsap.timeline();

    tl.to([leftRef.current, rightRef.current], {
      opacity: 1,
      y: 0,
      duration: 1.2,
      ease: "elastic.out(1, 0.5)", // Efecto elástico (rebote suave al caer)
      stagger: 0.2
    });
  }, []);

 
  const handleMouseEnter = () => {
    // El icono gira un poco y crece
    gsap.to(iconRef.current, {
      scale: 1.1,
      rotation: 15,
      duration: 0.3,
      ease: "back.out(1.7)"
    });
  };

  const handleMouseLeave = () => {
   
    gsap.to(iconRef.current, {
      scale: 1,
      rotation: 0,
      duration: 0.3,
      ease: "power2.out"
    });
  };

  return (
    <header className="header">
        
        {/* IZQUIERDA */}
        <div className="header-left" ref={leftRef}>
            
            <div 
                className="icon-wrapper" 
                onMouseEnter={handleMouseEnter} 
                onMouseLeave={handleMouseLeave}
            >
                
                 <i className="fas fa-hospital-symbol header-icon" ref={iconRef}></i>
            </div>
            
            <div className="header-texts">
                <h1>Centro de Salud Público "TULIPANES DE JALISCO"</h1>
                <p>Sistema Integral de Gestión</p>
            </div>
        </div>

        {/* DERECHA */}
        <div className="header-right" ref={rightRef}>
            <div className="status-text">CONEXIÓN SEGURA</div>
            {/* El punto con latido */}
            <div className="status-indicator"></div> 
        </div>

    </header>
  );
}

export default Header;