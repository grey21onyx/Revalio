import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Registrasi plugin ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Export gsap dan ScrollTrigger untuk digunakan di komponen
export { gsap, ScrollTrigger };

// Utility function untuk animasi scroll
export const createScrollAnimation = (element, options = {}) => {
  const defaultOptions = {
    opacity: 0,
    y: 50,
    duration: 1,
    ease: 'power3.out',
    stagger: 0.1,
    scrollTrigger: {
      trigger: element,
      start: 'top 80%',
      end: 'bottom 20%',
      toggleActions: 'play none none reverse',
    },
  };

  // Gabungkan options default dengan options yang diberikan
  const mergedOptions = {
    ...defaultOptions,
    ...options,
    scrollTrigger: {
      ...defaultOptions.scrollTrigger,
      ...(options.scrollTrigger || {}),
    },
  };

  // Buat animasi dengan GSAP
  return gsap.from(element, mergedOptions);
};

// Utility function untuk animasi parallax
export const createParallaxEffect = (elements, options = {}) => {
  elements.forEach((el) => {
    const speed = el.dataset.speed || 0.1;
    
    ScrollTrigger.create({
      trigger: el,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
      ...options,
      onUpdate: (self) => {
        const yPos = -self.progress * 100 * speed;
        gsap.to(el, {
          y: yPos,
          ease: 'none',
          overwrite: 'auto',
        });
      },
    });
  });
};

// Utility function untuk animasi stagger
export const createStaggerAnimation = (elements, options = {}) => {
  const defaultOptions = {
    opacity: 0,
    y: 20,
    duration: 0.8,
    stagger: 0.1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: elements[0].parentNode || elements[0],
      start: 'top 80%',
      toggleActions: 'play none none reverse',
    },
  };

  const mergedOptions = {
    ...defaultOptions,
    ...options,
    scrollTrigger: {
      ...defaultOptions.scrollTrigger,
      ...(options.scrollTrigger || {}),
    },
  };

  return gsap.from(elements, mergedOptions);
}; 