import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { gsap, ScrollTrigger } from '../../config/gsap';

/**
 * Komponen ParallaxEffect untuk efek parallax saat scroll
 * 
 * @param {Object} props - Props komponen
 * @param {React.ReactNode} props.children - Elemen yang akan diberi efek parallax
 * @param {Number} props.speed - Kecepatan parallax, nilai positif bergerak ke atas, negatif ke bawah
 * @param {Object} props.options - Opsi tambahan untuk ScrollTrigger
 */
const ParallaxEffect = ({ children, speed = 0.1, options = {} }) => {
  const elementRef = useRef(null);
  
  useEffect(() => {
    const element = elementRef.current;
    
    // Konfigurasi default ScrollTrigger
    const defaultOptions = {
      trigger: element,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    };
    
    // Gabungkan opsi default dengan opsi yang diberikan
    const mergedOptions = {
      ...defaultOptions,
      ...options,
      onUpdate: (self) => {
        // Efek parallax, menggerakkan elemen berdasarkan progress scroll
        const yPos = -self.progress * 100 * speed;
        gsap.to(element, {
          y: yPos,
          ease: 'none',
          overwrite: 'auto',
        });
        
        // Panggil onUpdate custom jika ada
        if (options.onUpdate) {
          options.onUpdate(self);
        }
      },
    };
    
    // Buat ScrollTrigger
    const trigger = ScrollTrigger.create(mergedOptions);
    
    // Cleanup saat komponen di-unmount
    return () => {
      trigger.kill();
    };
  }, [speed, options]);
  
  return (
    <div ref={elementRef} style={{ willChange: 'transform' }}>
      {children}
    </div>
  );
};

ParallaxEffect.propTypes = {
  children: PropTypes.node.isRequired,
  speed: PropTypes.number,
  options: PropTypes.object,
};

export default ParallaxEffect; 