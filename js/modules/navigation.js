/**
 * =============================================================================
 * GCMIRINCONCITO - MÓDULO DE NAVEGACIÓN
 * =============================================================================
 * 
 * Maneja la navegación SPA, menú móvil, scroll y header.
 * 
 * @version 1.0.0
 * @author GCMiRinconcito Team
 * =============================================================================
 */

/**
 * Clase para manejar la navegación del sitio
 */
class NavigationManager {
    constructor() {
        // Elementos del DOM
        this.header = document.getElementById('main-header');
        this.banner = document.querySelector('.banner-container');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.pages = document.querySelectorAll('.page-content');
        this.mobileMenuButton = document.getElementById('mobile-menu-button');
        this.mobileMenu = document.getElementById('mobile-menu');
        this.backToTopButton = document.getElementById('back-to-top');
        
        // Estado
        this.lastScrollTop = 0;
        
        this.init();
    }

    /**
     * Inicializa el gestor de navegación
     */
    init() {
        this.setupNavigationLinks();
        this.setupMobileMenu();
        this.setupScrollBehavior();
        this.setupBackToTop();
        this.setupKnowBreedsButton();
    }

    /**
     * Configura los enlaces de navegación
     */
    setupNavigationLinks() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = e.currentTarget.dataset.target;
                this.showPage(targetId);
            });
        });
    }

    /**
     * Muestra una página específica
     * @param {string} targetId - ID de la página a mostrar
     */
    showPage(targetId) {
        // Ocultar todas las páginas
        this.pages.forEach(page => page.classList.remove('active'));
        
        // Mostrar página objetivo
        const targetPage = document.getElementById(targetId);
        if (targetPage) {
            targetPage.classList.add('active');
        }
        
        // Actualizar navegación activa
        this.navLinks.forEach(link => {
            link.classList.toggle('active', link.dataset.target === targetId);
        });
        
        // Cerrar menú móvil
        this.mobileMenu?.classList.add('hidden');
        
        // Scroll al inicio
        window.scrollTo(0, 0);
        
        // Disparar evento personalizado para reinicializar animaciones
        document.dispatchEvent(new CustomEvent('pageChanged', { detail: { pageId: targetId } }));
    }

    /**
     * Configura el menú móvil
     */
    setupMobileMenu() {
        if (this.mobileMenuButton && this.mobileMenu) {
            this.mobileMenuButton.addEventListener('click', () => {
                this.mobileMenu.classList.toggle('hidden');
            });
        }
    }

    /**
     * Configura el comportamiento del scroll
     */
    setupScrollBehavior() {
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Ocultar/mostrar header
            if (this.header) {
                if (scrollTop > this.lastScrollTop && scrollTop > this.header.offsetHeight) {
                    this.header.classList.add('header-hidden');
                } else {
                    this.header.classList.remove('header-hidden');
                }
            }
            
            // Cambiar fondo del header
            const bannerHeight = this.banner ? this.banner.offsetHeight : 0;
            if (this.header) {
                if (scrollTop > bannerHeight) {
                    this.header.classList.remove('bg-white/80', 'backdrop-blur-lg');
                    this.header.style.backgroundColor = 'var(--bg-secondary)';
                } else {
                    this.header.classList.add('bg-white/80', 'backdrop-blur-lg');
                    this.header.style.backgroundColor = '';
                }
            }
            
            this.lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
        });
    }

    /**
     * Configura el botón de volver arriba
     */
    setupBackToTop() {
        if (!this.backToTopButton) return;
        
        window.addEventListener('scroll', () => {
            this.backToTopButton.classList.toggle('visible', window.pageYOffset > 300);
        });
        
        this.backToTopButton.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /**
     * Configura el botón "Conoce nuestras razas"
     */
    setupKnowBreedsButton() {
        const knowBreedsBtn = document.querySelector('.know-breeds-btn');
        if (knowBreedsBtn) {
            knowBreedsBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showPage('razas');
            });
        }
    }
}

export default NavigationManager;
