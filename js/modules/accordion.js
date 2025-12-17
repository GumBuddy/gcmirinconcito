/**
 * =============================================================================
 * GCMIRINCONCITO - MÓDULO DE ACORDEÓN
 * =============================================================================
 * 
 * Maneja la funcionalidad de acordeón para la sección de políticas.
 * 
 * @version 1.0.0
 * @author GCMiRinconcito Team
 * =============================================================================
 */

/**
 * Clase para manejar los acordeones
 */
class AccordionManager {
    constructor() {
        this.accordionHeaders = document.querySelectorAll('.accordion-header');
        this.init();
    }

    /**
     * Inicializa el acordeón
     */
    init() {
        this.setupEventListeners();
        this.setupKeyboardNavigation();
    }

    /**
     * Configura los event listeners
     */
    setupEventListeners() {
        this.accordionHeaders.forEach(header => {
            header.addEventListener('click', () => this.toggleAccordion(header));
        });
    }

    /**
     * Configura la navegación por teclado
     */
    setupKeyboardNavigation() {
        this.accordionHeaders.forEach(header => {
            header.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.toggleAccordion(header);
                }
                
                // Navegación entre acordeones
                if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                    e.preventDefault();
                    this.navigateAccordions(header, e.key === 'ArrowDown' ? 1 : -1);
                }
            });
        });
    }

    /**
     * Alterna el estado de un acordeón
     * @param {HTMLElement} header - Elemento header del acordeón
     */
    toggleAccordion(header) {
        const content = header.nextElementSibling;
        const icon = header.querySelector('.accordion-icon');
        const isActive = header.classList.contains('active');

        // Cerrar otros acordeones (comportamiento excluyente opcional)
        // this.closeAllAccordions();

        if (isActive) {
            this.closeAccordion(header, content, icon);
        } else {
            this.openAccordion(header, content, icon);
        }
    }

    /**
     * Abre un acordeón
     * @param {HTMLElement} header - Header del acordeón
     * @param {HTMLElement} content - Contenido del acordeón
     * @param {HTMLElement} icon - Icono del acordeón
     */
    openAccordion(header, content, icon) {
        header.classList.add('active');
        content.classList.add('active');
        content.style.maxHeight = content.scrollHeight + 'px';
        
        if (icon) {
            icon.style.transform = 'rotate(180deg)';
        }
        
        // Actualizar ARIA
        header.setAttribute('aria-expanded', 'true');
    }

    /**
     * Cierra un acordeón
     * @param {HTMLElement} header - Header del acordeón
     * @param {HTMLElement} content - Contenido del acordeón
     * @param {HTMLElement} icon - Icono del acordeón
     */
    closeAccordion(header, content, icon) {
        header.classList.remove('active');
        content.classList.remove('active');
        content.style.maxHeight = null;
        
        if (icon) {
            icon.style.transform = 'rotate(0deg)';
        }
        
        // Actualizar ARIA
        header.setAttribute('aria-expanded', 'false');
    }

    /**
     * Cierra todos los acordeones
     */
    closeAllAccordions() {
        this.accordionHeaders.forEach(header => {
            const content = header.nextElementSibling;
            const icon = header.querySelector('.accordion-icon');
            this.closeAccordion(header, content, icon);
        });
    }

    /**
     * Navega entre acordeones con el teclado
     * @param {HTMLElement} currentHeader - Header actual
     * @param {number} direction - Dirección (1 = abajo, -1 = arriba)
     */
    navigateAccordions(currentHeader, direction) {
        const headers = Array.from(this.accordionHeaders);
        const currentIndex = headers.indexOf(currentHeader);
        const nextIndex = currentIndex + direction;
        
        if (nextIndex >= 0 && nextIndex < headers.length) {
            headers[nextIndex].focus();
        }
    }

    /**
     * Abre un acordeón por ID
     * @param {string} id - ID del acordeón a abrir
     */
    openById(id) {
        const header = document.querySelector(`[data-accordion-id="${id}"]`);
        if (header && !header.classList.contains('active')) {
            this.toggleAccordion(header);
        }
    }

    /**
     * Cierra un acordeón por ID
     * @param {string} id - ID del acordeón a cerrar
     */
    closeById(id) {
        const header = document.querySelector(`[data-accordion-id="${id}"]`);
        if (header && header.classList.contains('active')) {
            this.toggleAccordion(header);
        }
    }
}

export default AccordionManager;
