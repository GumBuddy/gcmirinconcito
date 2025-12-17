/**
 * =============================================================================
 * GCMIRINCONCITO - MÓDULO DE RAZAS Y CARRUSEL
 * =============================================================================
 * 
 * Maneja la galería de razas, carrusel y modal de detalles.
 * 
 * @version 1.0.0
 * @author GCMiRinconcito Team
 * =============================================================================
 */

import { BREEDS_DATA, CAROUSEL_CONFIG } from './config.js';
import { getWhatsAppLink } from './utils.js';

/**
 * Clase para manejar la sección de razas
 */
class BreedsManager {
    constructor() {
        // Elementos del DOM
        this.gallery = document.querySelector('.breed-gallery');
        this.carousel = document.querySelector('.breed-carousel');
        this.prevBtn = document.getElementById('carousel-prev');
        this.nextBtn = document.getElementById('carousel-next');
        this.modal = document.getElementById('breed-modal');
        this.modalTitle = document.getElementById('modal-title');
        this.modalBody = document.getElementById('modal-body');
        this.closeModalBtn = document.querySelector('.close-modal');
        
        // Estado
        this.scrollAmount = 0;
        this.autoScrollInterval = null;
        this.cardWidth = CAROUSEL_CONFIG.cardWidth + CAROUSEL_CONFIG.gap;
        
        this.init();
    }

    /**
     * Inicializa el gestor de razas
     */
    init() {
        if (!this.gallery) return;
        
        this.renderBreedCards();
        this.setupCarouselNavigation();
        this.setupAutoScroll();
        this.setupModal();
    }

    /**
     * Renderiza las tarjetas de razas
     */
    renderBreedCards() {
        const breedKeys = Object.keys(BREEDS_DATA);
        
        // Crear HTML de tarjetas
        const createCardHTML = (key) => {
            const breed = BREEDS_DATA[key];
            return `
                <div class="breed-card bg-white rounded-xl shadow-lg overflow-hidden animate-on-scroll" 
                     data-category="${breed.category}" data-breed="${key}">
                    <div class="relative h-56 overflow-hidden">
                        <img src="${breed.images[0]}" alt="${breed.title}" 
                             class="w-full h-full object-cover transition-transform duration-700 hover:scale-110">
                        <div class="absolute top-4 right-4 bg-accent text-primary text-sm font-bold px-4 py-2 rounded-full">
                            ${breed.category.toUpperCase()}
                        </div>
                    </div>
                    <div class="breed-card-content">
                        <h3 class="breed-card-title">${breed.title}</h3>
                        <p class="breed-card-description">${breed.description.substring(0, 120)}...</p>
                        <div class="breed-card-characteristics">
                            ${breed.characteristics.slice(0, 3).map(c => `
                                <div class="breed-card-characteristic">
                                    <i class="fas fa-check-circle"></i>
                                    <strong>${c.name}:</strong> ${c.value}
                                </div>
                            `).join('')}
                        </div>
                        <div class="breed-card-footer">
                            <button class="view-details btn-accent w-full text-center" data-breed="${key}">
                                <i class="fas fa-info-circle mr-2"></i> Ver detalles completos
                            </button>
                        </div>
                    </div>
                </div>
            `;
        };

        // Duplicar tarjetas para efecto infinito
        const cardsHTML = breedKeys.map(createCardHTML).join('');
        this.gallery.innerHTML = cardsHTML + cardsHTML;

        // Calcular ancho total
        const totalCards = breedKeys.length * 2;
        const totalWidth = totalCards * CAROUSEL_CONFIG.cardWidth + (totalCards - 1) * CAROUSEL_CONFIG.gap;
        this.gallery.style.width = `${totalWidth}px`;

        // Configurar botones de detalles
        this.setupDetailButtons();
    }

    /**
     * Configura los botones de ver detalles
     */
    setupDetailButtons() {
        this.gallery.querySelectorAll('.view-details').forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const breedId = button.dataset.breed;
                this.openBreedModal(breedId);
            });
        });
    }

    /**
     * Abre el modal con detalles de una raza
     * @param {string} breedId - ID de la raza
     */
    openBreedModal(breedId) {
        const breed = BREEDS_DATA[breedId];
        if (!breed || !this.modal) return;

        this.modalTitle.textContent = breed.title;
        this.modalBody.innerHTML = `
            <div class="mb-8">
                <div class="carousel-container">
                    <div class="carousel-track">
                        ${breed.images.map(img => 
                            `<div class="carousel-slide" style="background-image: url('${img}')"></div>`
                        ).join('')}
                    </div>
                    <button class="carousel-nav carousel-prev"><i class="fas fa-chevron-left"></i></button>
                    <button class="carousel-nav carousel-next"><i class="fas fa-chevron-right"></i></button>
                </div>
                <div class="carousel-indicators">
                    ${breed.images.map((_, i) => 
                        `<span class="indicator ${i === 0 ? 'active' : ''}" data-index="${i}"></span>`
                    ).join('')}
                </div>
            </div>
            <div class="mb-8">
                <h3 class="text-2xl font-bold mb-4 text-primary">Descripción</h3>
                <p class="text-medium-text text-lg leading-relaxed">${breed.description}</p>
            </div>
            <div class="mb-8">
                <h3 class="text-2xl font-bold mb-6 text-primary">Características</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    ${breed.characteristics.map(c => `
                        <div class="bg-light p-4 rounded-lg border-l-4 border-accent">
                            <h4 class="font-semibold text-primary text-lg">${c.name}</h4>
                            <p class="text-medium-text">${c.value}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
            <div class="mt-10 text-center">
                <a href="${getWhatsAppLink(`Estoy interesado en la raza ${breed.title}`)}" 
                   target="_blank" class="btn-accent text-lg">
                    <i class="fab fa-whatsapp mr-2"></i> Consultar por esta raza
                </a>
            </div>
        `;
        
        this.modal.style.display = 'block';
        this.initModalCarousel();
    }

    /**
     * Inicializa el carrusel dentro del modal
     */
    initModalCarousel() {
        const track = this.modal.querySelector('.carousel-track');
        if (!track) return;

        const slides = Array.from(track.children);
        const nextBtn = this.modal.querySelector('.carousel-next');
        const prevBtn = this.modal.querySelector('.carousel-prev');
        const indicators = this.modal.querySelectorAll('.indicator');
        let currentIndex = 0;

        const updateCarousel = () => {
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
            indicators.forEach((ind, i) => ind.classList.toggle('active', i === currentIndex));
        };

        nextBtn?.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % slides.length;
            updateCarousel();
        });

        prevBtn?.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateCarousel();
        });

        indicators.forEach((ind, i) => {
            ind.addEventListener('click', () => {
                currentIndex = i;
                updateCarousel();
            });
        });
    }

    /**
     * Configura la navegación del carrusel principal
     */
    setupCarouselNavigation() {
        if (!this.carousel) return;

        this.prevBtn?.addEventListener('click', () => this.scrollPrev());
        this.nextBtn?.addEventListener('click', () => this.scrollNext());
        
        this.carousel.addEventListener('scroll', () => {
            this.scrollAmount = this.carousel.scrollLeft;
        });
    }

    /**
     * Desplaza el carrusel hacia atrás
     */
    scrollPrev() {
        this.scrollAmount -= this.cardWidth;
        if (this.scrollAmount < 0) {
            this.scrollAmount = this.gallery.scrollWidth - this.carousel.clientWidth;
            this.carousel.scrollLeft = this.scrollAmount;
            this.scrollAmount -= this.cardWidth;
        }
        this.carousel.scrollTo({ left: this.scrollAmount, behavior: 'smooth' });
    }

    /**
     * Desplaza el carrusel hacia adelante
     */
    scrollNext() {
        this.scrollAmount += this.cardWidth;
        if (this.scrollAmount > this.gallery.scrollWidth - this.carousel.clientWidth) {
            this.scrollAmount = 0;
            this.carousel.scrollLeft = this.scrollAmount;
            this.scrollAmount += this.cardWidth;
        }
        this.carousel.scrollTo({ left: this.scrollAmount, behavior: 'smooth' });
    }

    /**
     * Configura el auto-scroll del carrusel
     */
    setupAutoScroll() {
        const start = () => {
            this.stopAutoScroll();
            this.autoScrollInterval = setInterval(() => {
                this.scrollNext();
            }, CAROUSEL_CONFIG.autoScrollInterval);
        };

        const stop = () => this.stopAutoScroll();

        // Pausar al hacer hover
        [this.carousel, this.prevBtn, this.nextBtn].forEach(el => {
            el?.addEventListener('mouseenter', stop);
            el?.addEventListener('mouseleave', start);
        });

        // Iniciar auto-scroll
        start();
    }

    /**
     * Detiene el auto-scroll
     */
    stopAutoScroll() {
        if (this.autoScrollInterval) {
            clearInterval(this.autoScrollInterval);
            this.autoScrollInterval = null;
        }
    }

    /**
     * Configura el modal
     */
    setupModal() {
        // Cerrar con botón
        this.closeModalBtn?.addEventListener('click', () => {
            this.modal.style.display = 'none';
        });

        // Cerrar al hacer clic fuera
        window.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.modal.style.display = 'none';
            }
        });
    }
}

export default BreedsManager;
