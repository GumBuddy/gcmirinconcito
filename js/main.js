/**
 * Archivo JavaScript mejorado para el sitio web GCMiRinconcito
 * 
 * Autor: Full Stack Senior Developer & UX/UI Designer
 * Propósito: Funcionalidades interactivas y dinámicas
 * Dependencias: Ninguna
 */

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar todas las funcionalidades
    initMobileMenu();
    initScrollEffects();
    initAnimations();
    initGalleries();
    initSmoothScroll();
    initFormValidation();
    initNotifications();
    initScrollToTop();
    initLazyLoading();
});

/**
 * Función para manejar el menú de navegación en dispositivos móviles
 */
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            // Alternar la clase 'active' en el menú de navegación
            navMenu.classList.toggle('active');
            
            // Alternar la clase 'active' en el botón hamburguesa
            hamburger.classList.toggle('active');
        });
    }
    
    // Cerrar el menú cuando se hace clic en un enlace
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });
}

/**
 * Función para manejar efectos al hacer scroll
 */
function initScrollEffects() {
    const header = document.querySelector('.header');
    
    // Cambiar el header al hacer scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Revelar elementos al hacer scroll
    const revealElements = document.querySelectorAll('.scroll-reveal');
    
    const revealOnScroll = function() {
        revealElements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;
            
            if (elementPosition < screenPosition) {
                element.classList.add('active');
            }
        });
    };
    
    // Ejecutar al cargar y al hacer scroll
    window.addEventListener('load', revealOnScroll);
    window.addEventListener('scroll', revealOnScroll);
}

/**
 * Función para inicializar animaciones
 */
function initAnimations() {
    // Animar elementos con la clase 'animate-fade-in'
    const fadeElements = document.querySelectorAll('.animate-fade-in');
    
    fadeElements.forEach((element, index) => {
        setTimeout(() => {
            element.style.opacity = '1';
        }, index * 100);
    });
    
    // Animar elementos con la clase 'animate-slide-up'
    const slideElements = document.querySelectorAll('.animate-slide-up');
    
    slideElements.forEach((element, index) => {
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 150);
    });
}

/**
 * Función para inicializar galerías de imágenes
 */
function initGalleries() {
    const galleries = document.querySelectorAll('.gallery-container');
    
    galleries.forEach(gallery => {
        initializeGallery(gallery);
    });
}

/**
 * Función para inicializar una galería de imágenes
 * @param {HTMLElement} gallery - Elemento contenedor de la galería
 */
function initializeGallery(gallery) {
    // Obtener elementos de la galería
    const mainImage = gallery.querySelector('.gallery-active');
    const thumbnails = gallery.querySelectorAll('.thumbnail');
    const prevButton = gallery.querySelector('.gallery-prev');
    const nextButton = gallery.querySelector('.gallery-next');
    
    // Verificar que existan los elementos necesarios
    if (!mainImage || thumbnails.length === 0) return;
    
    // Índice de la imagen actual
    let currentIndex = 0;
    
    // Array de rutas de imágenes
    const images = Array.from(thumbnails).map(thumb => thumb.src);
    
    // Agregar evento de clic a las miniaturas
    thumbnails.forEach((thumbnail, index) => {
        thumbnail.addEventListener('click', function() {
            // Cambiar a la imagen seleccionada
            setImage(index);
        });
    });
    
    // Agregar evento de clic al botón anterior
    if (prevButton) {
        prevButton.addEventListener('click', function() {
            // Ir a la imagen anterior
            const newIndex = (currentIndex - 1 + images.length) % images.length;
            setImage(newIndex);
        });
    }
    
    // Agregar evento de clic al botón siguiente
    if (nextButton) {
        nextButton.addEventListener('click', function() {
            // Ir a la siguiente imagen
            const newIndex = (currentIndex + 1) % images.length;
            setImage(newIndex);
        });
    }
    
    // Agregar soporte para gestos táctiles en dispositivos móviles
    let touchStartX = 0;
    let touchEndX = 0;
    
    gallery.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    gallery.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    /**
     * Función para manejar el gesto de deslizamiento
     */
    function handleSwipe() {
        // Umbral para considerar un deslizamiento válido
        const swipeThreshold = 50;
        
        // Calcular la diferencia
        const diff = touchStartX - touchEndX;
        
        // Determinar la dirección del deslizamiento
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Deslizamiento hacia la izquierda - siguiente imagen
                const newIndex = (currentIndex + 1) % images.length;
                setImage(newIndex);
            } else {
                // Deslizamiento hacia la derecha - imagen anterior
                const newIndex = (currentIndex - 1 + images.length) % images.length;
                setImage(newIndex);
            }
        }
    }
    
    /**
     * Función para cambiar la imagen actual
     * @param {number} index - Índice de la imagen a mostrar
     */
    function setImage(index) {
        // Validar el índice
        if (index < 0 || index >= images.length) return;
        
        // Actualizar el índice actual
        currentIndex = index;
        
        // Cambiar la imagen principal con efecto de transición
        mainImage.style.opacity = '0';
        setTimeout(() => {
            mainImage.src = images[currentIndex];
            mainImage.style.opacity = '1';
        }, 200);
        
        // Actualizar la clase activa en las miniaturas
        thumbnails.forEach((thumb, i) => {
            if (i === currentIndex) {
                thumb.classList.add('active');
            } else {
                thumb.classList.remove('active');
            }
        });
    }
    
    // Agregar navegación con teclado
    document.addEventListener('keydown', function(e) {
        // Verificar si la galería está visible en la pantalla
        const rect = gallery.getBoundingClientRect();
        const isVisible = (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
        
        if (!isVisible) return;
        
        // Manejar teclas de flecha izquierda y derecha
        if (e.key === 'ArrowLeft') {
            const newIndex = (currentIndex - 1 + images.length) % images.length;
            setImage(newIndex);
        } else if (e.key === 'ArrowRight') {
            const newIndex = (currentIndex + 1) % images.length;
            setImage(newIndex);
        }
    });
    
    // Inicializar la primera imagen como activa
    setImage(0);
}

/**
 * Función para implementar scroll suave para anclas internas
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Ajuste para el header fijo
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Función para validar formularios
 */
function initFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!validateForm(form)) {
                e.preventDefault();
            }
        });
    });
}

/**
 * Función para validar un formulario
 * @param {HTMLElement} form - Formulario a validar
 * @returns {boolean} - True si el formulario es válido, False si no
 */
function validateForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            field.classList.add('error');
            
            // Crear mensaje de error si no existe
            let errorMessage = field.nextElementSibling;
            if (!errorMessage || !errorMessage.classList.contains('error-message')) {
                errorMessage = document.createElement('span');
                errorMessage.className = 'error-message';
                errorMessage.textContent = 'Este campo es obligatorio';
                field.parentNode.insertBefore(errorMessage, field.nextSibling);
            }
        } else {
            field.classList.remove('error');
            
            // Eliminar mensaje de error si existe
            const errorMessage = field.nextElementSibling;
            if (errorMessage && errorMessage.classList.contains('error-message')) {
                errorMessage.remove();
            }
        }
    });
    
    return isValid;
}

/**
 * Función para inicializar notificaciones
 */
function initNotifications() {
    // Las notificaciones se manejan a través de la función global showNotification()
}

/**
 * Función para mostrar notificaciones
 * @param {string} message - Mensaje a mostrar
 * @param {string} type - Tipo de notificación (success, error, info)
 */
function showNotification(message, type = 'success') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Agregar al DOM
    document.body.appendChild(notification);
    
    // Mostrar notificación
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Cerrar notificación al hacer clic en el botón
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 500);
    });
    
    // Cerrar automáticamente después de 5 segundos
    setTimeout(() => {
        if (notification.parentNode) {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 500);
        }
    }, 5000);
}

/**
 * Función para inicializar el botón de volver arriba
 */
function initScrollToTop() {
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollTopBtn.className = 'scroll-top-btn';
    document.body.appendChild(scrollTopBtn);
    
    // Mostrar/ocultar botón al hacer scroll
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });
    
    // Scroll hacia arriba al hacer clic
    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * Función para inicializar lazy loading de imágenes
 */
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imgOptions = {
            threshold: 0,
            rootMargin: "0px 0px 300px 0px"
        };
        
        const imgObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imgObserver.unobserve(img);
                }
            });
        }, imgOptions);
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imgObserver.observe(img);
        });
    } else {
        // Fallback para navegadores que no soportan IntersectionObserver
        document.querySelectorAll('img[data-src]').forEach(img => {
            img.src = img.dataset.src;
        });
    }
}

/**
 * Función para manejar peticiones fetch con manejo de errores
 * @param {string} url - URL a la que se realizará la petición
 * @param {Object} options - Opciones de la petición
 * @returns {Promise} - Promesa con los datos de la respuesta
 */
async function fetchData(url, options = {}) {
    try {
        // Mostrar indicador de carga
        showLoadingIndicator();
        
        // Realizar petición
        const response = await fetch(url, options);
        
        // Verificar si la respuesta fue exitosa
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        // Obtener datos en formato JSON
        const data = await response.json();
        
        // Ocultar indicador de carga
        hideLoadingIndicator();
        
        return data;
    } catch (error) {
        // Ocultar indicador de carga
        hideLoadingIndicator();
        
        // Mostrar mensaje de error
        showNotification(`Error: ${error.message}`, 'error');
        
        // Propagar error para manejo externo si es necesario
        throw error;
    }
}

/**
 * Función para mostrar indicador de carga
 */
function showLoadingIndicator() {
    // Verificar si ya existe un indicador
    let loadingIndicator = document.querySelector('.loading-indicator');
    
    // Si no existe, crearlo
    if (!loadingIndicator) {
        loadingIndicator = document.createElement('div');
        loadingIndicator.className = 'loading-indicator';
        loadingIndicator.innerHTML = `
            <div class="loading-spinner"></div>
            <p>Cargando...</p>
        `;
        document.body.appendChild(loadingIndicator);
    }
    
    // Mostrar indicador
    loadingIndicator.classList.add('show');
}

/**
 * Función para ocultar indicador de carga
 */
function hideLoadingIndicator() {
    const loadingIndicator = document.querySelector('.loading-indicator');
    if (loadingIndicator) {
        loadingIndicator.classList.remove('show');
    }
}

/**
 * Función para formatear precios
 * @param {number} price - Precio a formatear
 * @returns {string} - Precio formateado
 */
function formatPrice(price) {
    return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN'
    }).format(price);
}

/**
 * Función para validar un email
 * @param {string} email - Email a validar
 * @returns {boolean} - True si el email es válido, False si no
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Función para validar un número de teléfono
 * @param {string} phone - Número de teléfono a validar
 * @returns {boolean} - True si el teléfono es válido, False si no
 */
function isValidPhoneNumber(phone) {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}