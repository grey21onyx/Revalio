import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { gsap, ScrollTrigger } from '../../config/gsap';

/**
 * Komponen ScrollAnimation untuk animasi elemen saat di-scroll
 * 
 * @param {Object} props - Props komponen
 * @param {React.ReactNode} props.children - Elemen yang akan dianimasikan
 * @param {Object} props.from - Nilai awal animasi
 * @param {Object} props.to - Nilai akhir animasi
 * @param {Object} props.scrollTriggerOptions - Opsi untuk ScrollTrigger
 * @param {Number} props.duration - Durasi animasi dalam detik
 * @param {String} props.ease - Jenis ease animasi
 * @param {Number} props.delay - Delay animasi dalam detik
 */
const ScrollAnimation = ({ 
  children, 
  from = { opacity: 0, y: 50 }, 
  to = { opacity: 1, y: 0 },
  scrollTriggerOptions = {}, 
  duration = 1, 
  ease = 'power3.out',
  delay = 0
}) => {
  const elementRef = useRef(null);
  
  useEffect(() => {
    const element = elementRef.current;
    
    // Konfigurasi default ScrollTrigger
    const defaultScrollTriggerOptions = {
      trigger: element,
      start: 'top 80%',
      end: 'bottom 20%',
      toggleActions: 'play none none reverse',
    };
    
    // Gabungkan opsi default dengan opsi yang diberikan
    const mergedScrollTriggerOptions = {
      ...defaultScrollTriggerOptions,
      ...scrollTriggerOptions,
    };
    
    // Buat animasi
    const animation = gsap.fromTo(
      element, 
      from, 
      {
        ...to,
        duration,
        ease,
        delay,
        scrollTrigger: mergedScrollTriggerOptions,
      }
    );
    
    // Cleanup saat komponen di-unmount
    return () => {
      if (animation.scrollTrigger) {
        animation.scrollTrigger.kill();
      }
      animation.kill();
    };
  }, [from, to, scrollTriggerOptions, duration, ease, delay]);
  
  return (
    <div ref={elementRef}>
      {children}
    </div>
  );
};

ScrollAnimation.propTypes = {
  children: PropTypes.node.isRequired,
  from: PropTypes.object,
  to: PropTypes.object,
  scrollTriggerOptions: PropTypes.object,
  duration: PropTypes.number,
  ease: PropTypes.string,
  delay: PropTypes.number,
};

export default ScrollAnimation; 