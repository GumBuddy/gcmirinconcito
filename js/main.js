/**
 * =============================================================================
 * GCMIRINCONCITO - APLICACIÓN PRINCIPAL
 * =============================================================================
 * 
 * Punto de entrada principal de la aplicación.
 * Inicializa todos los módulos y gestiona el ciclo de vida de la app.
 * 
 * @version 1.0.0
 * @author GCMiRinconcito Team
 * =============================================================================
 */

// Importar módulos
import { APP_CONFIG, BREEDS_DATA, WHATSAPP_CONFIG } from './modules/config.js';
import { getWhatsAppLink } from './modules/utils.js';
import ThemeManager from './modules/theme.js';
import NavigationManager from './modules/navigation.js';
import BreedsManager from './modules/breeds.js';
import ChatbotManager from './modules/chatbot.js';
import AccordionManager from './modules/accordion.js';
import AnimationsManager from './modules/animations.js';

/**
 * Clase principal de la aplicación
 */
class App {
    constructor() {
        this.modules = {};
        this.isInitialized = false;
    }

    /**
     * Inicializa la aplicación
     */
    async init() {
        if (this.isInitialized) {
            console.warn('App already initialized');
            return;
        }

        try {
            console.log(`🐰 ${APP_CONFIG.appName} v${APP_CONFIG.version} - Initializing...`);
            
            // Esperar a que el DOM esté listo
            await this.waitForDOM();
            
            // Marcar que JavaScript está listo (para animaciones CSS)
            document.body.classList.add('js-ready');
            
            // Inicializar módulos
            this.initModules();
            
            // Configurar event listeners globales
            this.setupGlobalListeners();
            
            this.isInitialized = true;
            console.log('✅ App initialized successfully!');
            
        } catch (error) {
            console.error('❌ Error initializing app:', error);
            // Si hay error, asegurar que el contenido sea visible
            document.body.classList.remove('js-ready');
        }
    }

    /**
     * Espera a que el DOM esté listo
     * @returns {Promise} Promesa que se resuelve cuando el DOM está listo
     */
    waitForDOM() {
        return new Promise((resolve) => {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', resolve);
            } else {
                resolve();
            }
        });
    }

    /**
     * Inicializa todos los módulos
     */
    initModules() {
        // Tema (dark/light mode)
        this.modules.theme = new ThemeManager();
        console.log('  ✓ Theme module loaded');
        
        // Navegación
        this.modules.navigation = new NavigationManager();
        console.log('  ✓ Navigation module loaded');
        
        // Carrusel de razas
        this.modules.breeds = new BreedsManager(BREEDS_DATA);
        console.log('  ✓ Breeds module loaded');
        
        // Acordeón de políticas
        this.modules.accordion = new AccordionManager();
        console.log('  ✓ Accordion module loaded');
        
        // Animaciones
        this.modules.animations = new AnimationsManager();
        console.log('  ✓ Animations module loaded');
        
        // Chatbot (último para que no bloquee)
        this.modules.chatbot = new ChatbotManager();
        console.log('  ✓ Chatbot module loaded');
        
        // Configurar enlaces de WhatsApp
        this.setupWhatsAppLinks();
    }

    /**
     * Configura los enlaces de WhatsApp
     */
    setupWhatsAppLinks() {
        const links = {
            'whatsapp-banner': WHATSAPP_CONFIG.messages.banner,
            'whatsapp-services': WHATSAPP_CONFIG.messages.services,
            'whatsapp-club': WHATSAPP_CONFIG.messages.club,
            'whatsapp-footer': ''
        };

        Object.entries(links).forEach(([id, message]) => {
            const element = document.getElementById(id);
            if (element) {
                element.href = getWhatsAppLink(message);
            }
        });
    }

    /**
     * Configura event listeners globales
     */
    setupGlobalListeners() {
        // Manejar errores no capturados
        window.addEventListener('error', (event) => {
            console.error('Unhandled error:', event.error);
        });

        // Manejar promesas rechazadas no capturadas
        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
        });

        // Limpiar al cerrar la página
        window.addEventListener('beforeunload', () => {
            this.cleanup();
        });

        // Manejar cambios de visibilidad
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.onHidden();
            } else {
                this.onVisible();
            }
        });

        // Detectar conexión lenta
        this.detectSlowConnection();
    }

    /**
     * Se ejecuta cuando la página se oculta
     */
    onHidden() {
        // Pausar animaciones, timers, etc.
        console.log('Page hidden');
    }

    /**
     * Se ejecuta cuando la página se vuelve visible
     */
    onVisible() {
        // Reanudar animaciones, timers, etc.
        console.log('Page visible');
    }

    /**
     * Detecta conexión lenta
     */
    detectSlowConnection() {
        if ('connection' in navigator) {
            const connection = navigator.connection;
            
            if (connection.saveData || connection.effectiveType === '2g') {
                document.body.classList.add('slow-connection');
                console.log('Slow connection detected - reducing animations');
            }
            
            connection.addEventListener('change', () => {
                if (connection.saveData || connection.effectiveType === '2g') {
                    document.body.classList.add('slow-connection');
                } else {
                    document.body.classList.remove('slow-connection');
                }
            });
        }
    }

    /**
     * Limpia recursos al cerrar
     */
    cleanup() {
        // Limpiar módulos
        if (this.modules.animations) {
            this.modules.animations.destroy();
        }
        
        console.log('App cleanup completed');
    }

    /**
     * Obtiene un módulo por nombre
     * @param {string} moduleName - Nombre del módulo
     * @returns {Object|null} Instancia del módulo
     */
    getModule(moduleName) {
        return this.modules[moduleName] || null;
    }
}

// Crear instancia global de la app
const app = new App();

// Inicializar cuando esté listo
app.init();

// Exportar para uso global si es necesario
export default app;

// También hacerla disponible globalmente para debugging
window.GCMiRinconcitoApp = app;
