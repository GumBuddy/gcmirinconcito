/**
 * Archivo JavaScript para la funcionalidad de galerías de imágenes
 * 
 * Autor: Full Stack Senior Developer & UX/UI Designer
 * Propósito: Implementar la funcionalidad de galerías de imágenes en la página de razas
 * Dependencias: Ninguna
 */

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar todas las galerías de la página
    const galleries = document.querySelectorAll('.gallery-container');
    
    galleries.forEach(gallery => {
        initializeGallery(gallery);
    });
});

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
        
        // Cambiar la imagen principal
        mainImage.src = images[currentIndex];
        
        // Actualizar la clase activa en las miniaturas
        thumbnails.forEach((thumb, i) => {
            if (i === currentIndex) {
                thumb.classList.add('active');
            } else {
                thumb.classList.remove('active');
            }
        });
        
        // Agregar efecto de transición
        mainImage.style.opacity = '0';
        setTimeout(() => {
            mainImage.style.opacity = '1';
        }, 50);
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
 * Función para crear una galería dinámicamente
 * @param {HTMLElement} container - Contenedor donde se creará la galería
 * @param {Array} images - Array de rutas de imágenes
 * @param {Object} options - Opciones de configuración
 */
function createGallery(container, images, options = {}) {
    // Opciones por defecto
    const defaultOptions = {
        showThumbnails: true,
        showButtons: true,
        autoPlay: false,
        autoPlayInterval: 5000
    };
    
    // Combinar opciones por defecto con las proporcionadas
    const settings = { ...defaultOptions, ...options };
    
    // Verificar que el contenedor y las imágenes existan
    if (!container || !images || images.length === 0) return;
    
    // Crear estructura HTML de la galería
    const galleryHTML = `
        <div class="gallery-container">
            <div class="gallery-main">
                <img src="${images[0]}" alt="Imagen de galería" class="gallery-active">
            </div>
            ${settings.showThumbnails ? `
                <div class="gallery-thumbnails">
                    ${images.map((src, index) => `
                        <img src="${src}" alt="Miniatura ${index + 1}" class="thumbnail ${index === 0 ? 'active' : ''}">
                    `).join('')}
                </div>
            ` : ''}
            ${settings.showButtons ? `
                <button class="gallery-prev"><i class="fas fa-chevron-left"></i></button>
                <button class="gallery-next"><i class="fas fa-chevron-right"></i></button>
            ` : ''}
        </div>
    `;
    
    // Insertar HTML en el contenedor
    container.innerHTML = galleryHTML;
    
    // Obtener la galería recién creada
    const gallery = container.querySelector('.gallery-container');
    
    // Inicializar la galería
    initializeGallery(gallery);
    
    // Configurar autoplay si está habilitado
    if (settings.autoPlay) {
        let autoPlayInterval = setInterval(() => {
            const nextButton = gallery.querySelector('.gallery-next');
            if (nextButton) {
                nextButton.click();
            }
        }, settings.autoPlayInterval);
        
        // Pausar autoplay cuando el usuario interactúa con la galería
        gallery.addEventListener('mouseenter', () => {
            clearInterval(autoPlayInterval);
        });
        
        gallery.addEventListener('mouseleave', () => {
            autoPlayInterval = setInterval(() => {
                const nextButton = gallery.querySelector('.gallery-next');
                if (nextButton) {
                    nextButton.click();
                }
            }, settings.autoPlayInterval);
        });
    }
    
    // Devolver la galería para posibles manipulaciones adicionales
    return gallery;
}