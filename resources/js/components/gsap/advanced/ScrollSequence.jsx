import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { gsap, ScrollTrigger } from '../../../config/gsap';

/**
 * Komponen ScrollSequence untuk membuat urutan animasi yang dipicu oleh scrolling
 * 
 * @param {Object} props - Props komponen
 * @param {React.ReactNode} props.children - Elemen yang akan dianimasikan
 * @param {Array} props.animations - Array berisi objek konfigurasi animasi
 * @param {Object} props.scrollTriggerOptions - Opsi untuk ScrollTrigger
 */
const ScrollSequence = ({ 
  children, 
  animations = [], 
  scrollTriggerOptions = {} 
}) => {
  const containerRef = useRef(null);
  const timelineRef = useRef(null);
  
  useEffect(() => {
    const container = containerRef.current;
    
    // Buat timeline untuk animasi sequence
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: 'top center',
        end: 'bottom center',
        scrub: true,
        pin: scrollTriggerOptions.pin !== undefined ? scrollTriggerOptions.pin : false,
        pinSpacing: scrollTriggerOptions.pinSpacing !== undefined ? scrollTriggerOptions.pinSpacing : true,
        ...scrollTriggerOptions,
      }
    });
    
    // Simpan timeline di ref untuk cleanup
    timelineRef.current = timeline;
    
    // Tambahkan animasi ke timeline
    animations.forEach((animation) => {
      const { target, duration = 1, position = '+=0', ...animProps } = animation;
      const targetElement = target ? container.querySelector(target) : container;
      
      if (targetElement) {
        timeline.to(targetElement, {
          duration,
          ...animProps,
        }, position);
      } else {
        console.warn(`Target element "${target}" not found in ScrollSequence`);
      }
    });
    
    // Cleanup
    return () => {
      if (timelineRef.current && timelineRef.current.scrollTrigger) {
        timelineRef.current.scrollTrigger.kill();
      }
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, [animations, scrollTriggerOptions]);
  
  return (
    <div ref={containerRef}>
      {children}
    </div>
  );
};

ScrollSequence.propTypes = {
  children: PropTypes.node.isRequired,
  animations: PropTypes.arrayOf(
    PropTypes.shape({
      target: PropTypes.string,
      duration: PropTypes.number,
      position: PropTypes.string,
    })
  ),
  scrollTriggerOptions: PropTypes.object,
};

export default ScrollSequence; 