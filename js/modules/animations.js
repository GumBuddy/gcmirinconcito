/**
 * =============================================================================
 * GCMIRINCONCITO - MÓDULO DE ANIMACIONES
 * =============================================================================
 * 
 * Maneja las animaciones de scroll reveal y efectos visuales.
 * 
 * @version 1.0.0
 * @author GCMiRinconcito Team
 * =============================================================================
 */

/**
 * Clase para manejar las animaciones
 */
class AnimationsManager {
    constructor() {
        this.observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };
        
        this.observer = null;
        this.init();
    }

    /**
     * Inicializa el sistema de animaciones
     */
    init() {
        this.createObserver();
        this.observeElements();
        this.setupReducedMotion();
    }

    /**
     * Crea el Intersection Observer
     */
    createObserver() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-visible');
                    
                    // Aplicar delay si existe
                    const delay = entry.target.dataset.animateDelay;
                    if (delay) {
                        entry.target.style.animationDelay = delay;
                    }
                    
                    // Opcionalmente dejar de observar
                    // this.observer.unobserve(entry.target);
                }
            });
        }, this.observerOptions);
    }

    /**
     * Observa elementos con clases de animación
     */
    observeElements() {
        const animatedElements = document.querySelectorAll(
            '.animate-on-scroll, .fade-up, .fade-in, .scale-in, .slide-in-left, .slide-in-right'
        );
        
        animatedElements.forEach(el => {
            // No añadir animate-hidden, usar directamente el observer
            this.observer.observe(el);
        });
    }

    /**
     * Configura preferencias de movimiento reducido
     */
    setupReducedMotion() {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        if (mediaQuery.matches) {
            this.disableAnimations();
        }
        
        mediaQuery.addEventListener('change', (e) => {
            if (e.matches) {
                this.disableAnimations();
            } else {
                this.enableAnimations();
            }
        });
    }

    /**
     * Desactiva las animaciones
     */
    disableAnimations() {
        document.documentElement.classList.add('reduce-motion');
        
        const animatedElements = document.querySelectorAll('.animate-hidden');
        animatedElements.forEach(el => {
            el.classList.remove('animate-hidden');
            el.classList.add('animate-visible');
        });
    }

    /**
     * Activa las animaciones
     */
    enableAnimations() {
        document.documentElement.classList.remove('reduce-motion');
    }

    /**
     * Añade efecto parallax a un elemento
     * @param {HTMLElement} element - Elemento a animar
     * @param {number} speed - Velocidad del parallax (default 0.5)
     */
    addParallax(element, speed = 0.5) {
        const handleScroll = () => {
            const scrolled = window.pageYOffset;
            const rect = element.getBoundingClientRect();
            
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px)`;
            }
        };
        
        window.addEventListener('scroll', handleScroll, { passive: true });
    }

    /**
     * Añade efecto de typing a un elemento
     * @param {HTMLElement} element - Elemento con texto
     * @param {number} speed - Velocidad en ms por caracter
     */
    typewriterEffect(element, speed = 50) {
        const text = element.textContent;
        element.textContent = '';
        element.style.visibility = 'visible';
        
        let i = 0;
        const type = () => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        };
        
        type();
    }

    /**
     * Añade efecto de contador numérico
     * @param {HTMLElement} element - Elemento con número
     * @param {number} duration - Duración de la animación en ms
     */
    countUp(element, duration = 2000) {
        const target = parseInt(element.textContent, 10);
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;
        
        const updateCount = () => {
            current += increment;
            if (current < target) {
                element.textContent = Math.ceil(current);
                requestAnimationFrame(updateCount);
            } else {
                element.textContent = target;
            }
        };
        
        updateCount();
    }

    /**
     * Añade animación de entrada escalonada a un grupo de elementos
     * @param {NodeList|Array} elements - Elementos a animar
     * @param {number} staggerDelay - Delay entre elementos en ms
     */
    staggeredEntrance(elements, staggerDelay = 100) {
        elements.forEach((el, index) => {
            el.style.animationDelay = `${index * staggerDelay}ms`;
            el.classList.add('stagger-in');
        });
    }

    /**
     * Destruye el observer
     */
    destroy() {
        if (this.observer) {
            this.observer.disconnect();
            this.observer = null;
        }
    }
}

export default AnimationsManager;
