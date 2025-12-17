/**
 * =============================================================================
 * GCMIRINCONCITO - MÓDULO DE TEMA
 * =============================================================================
 * 
 * Maneja el cambio entre tema claro y oscuro.
 * 
 * @version 1.0.0
 * @author GCMiRinconcito Team
 * =============================================================================
 */

/**
 * Clase para manejar el tema de la aplicación
 */
class ThemeManager {
    constructor() {
        this.themeToggle = document.getElementById('theme-toggle');
        this.themeToggleMobile = document.getElementById('theme-toggle-mobile');
        this.storageKey = 'theme';
        
        this.init();
    }

    /**
     * Inicializa el gestor de tema
     */
    init() {
        // Cargar tema guardado
        this.loadSavedTheme();
        
        // Configurar event listeners
        this.setupEventListeners();
    }

    /**
     * Carga el tema guardado en localStorage
     */
    loadSavedTheme() {
        const savedTheme = localStorage.getItem(this.storageKey);
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
            this.updateIcons(true);
        }
    }

    /**
     * Configura los event listeners
     */
    setupEventListeners() {
        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', () => this.toggle());
        }
        if (this.themeToggleMobile) {
            this.themeToggleMobile.addEventListener('click', () => this.toggle());
        }
    }

    /**
     * Alterna entre tema claro y oscuro
     */
    toggle() {
        document.body.classList.toggle('dark-theme');
        const isDark = document.body.classList.contains('dark-theme');
        
        this.updateIcons(isDark);
        this.saveTheme(isDark);
    }

    /**
     * Actualiza los iconos del toggle
     * @param {boolean} isDark - Si el tema oscuro está activo
     */
    updateIcons(isDark) {
        const icons = [
            this.themeToggle?.querySelector('i'),
            this.themeToggleMobile?.querySelector('i')
        ].filter(Boolean);

        icons.forEach(icon => {
            if (isDark) {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            } else {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
            }
        });
    }

    /**
     * Guarda la preferencia de tema
     * @param {boolean} isDark - Si el tema oscuro está activo
     */
    saveTheme(isDark) {
        localStorage.setItem(this.storageKey, isDark ? 'dark' : 'light');
    }

    /**
     * Verifica si el tema oscuro está activo
     * @returns {boolean}
     */
    isDarkMode() {
        return document.body.classList.contains('dark-theme');
    }
}

// Exportar instancia única
export default ThemeManager;
